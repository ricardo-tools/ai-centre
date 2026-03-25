'use server';

import { eq } from 'drizzle-orm';
import { users, verificationTokens, invitations, roles } from '@/platform/db/schema';
import { generateOtp, hashOtp, isAllowedDomain, OTP_EXPIRY_MS, MAX_ATTEMPTS } from '@/platform/lib/otp';
import { sendOtpEmail } from '@/platform/lib/email';
import { createSession, clearSession } from '@/platform/lib/auth';
import { redirect } from 'next/navigation';
import { type Result, Ok, Err, ValidationError, AuthError } from '@/platform/lib/result';
import { checkRateLimit } from '@/platform/lib/rate-limit';
import { getDb } from '@/platform/db/client';

export async function requestOtp(email: string): Promise<Result<void, ValidationError>> {
  const normalizedEmail = email.trim().toLowerCase();

  // Rate limit: 3 OTP requests per email per 15 minutes
  const rateCheck = checkRateLimit(`otp:${normalizedEmail}`, 3, 15 * 60 * 1000);
  if (!rateCheck.allowed) {
    return Err(new ValidationError('rateLimited', `Too many requests. Try again in ${Math.ceil(rateCheck.retryAfterMs / 1000)} seconds`));
  }

  if (!isAllowedDomain(normalizedEmail)) {
    return Err(new ValidationError('invalidDomain', 'Email domain is not allowed'));
  }

  if (!process.env.DATABASE_URL) {
    return Err(new ValidationError('configError', 'Database is not configured'));
  }

  try {
    const db = getDb();

    // Generate OTP and hash it
    const code = generateOtp();
    const hashedCode = await hashOtp(code);

    // Delete any existing tokens for this email
    await db.delete(verificationTokens).where(eq(verificationTokens.email, normalizedEmail));

    // Insert new token
    await db.insert(verificationTokens).values({
      email: normalizedEmail,
      token: hashedCode,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    });

    // Upsert user — for new users, check invitation for role assignment
    const existingUser = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
    if (existingUser.length === 0) {
      const namePart = normalizedEmail.split('@')[0];
      const displayName = namePart
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      // Check for pending invitation to determine role
      let assignRoleId: string | null = null;
      const [invitation] = await db
        .select()
        .from(invitations)
        .where(eq(invitations.email, normalizedEmail))
        .limit(1);

      if (invitation && invitation.status === 'pending') {
        assignRoleId = invitation.roleId;
      } else if (process.env.ADMIN_EMAIL && normalizedEmail === process.env.ADMIN_EMAIL.toLowerCase()) {
        // Auto-promote configured admin email
        const [adminRole] = await db
          .select()
          .from(roles)
          .where(eq(roles.slug, 'admin'))
          .limit(1);
        if (adminRole) {
          assignRoleId = adminRole.id;
        }
      } else {
        // Default to 'member' role
        const [memberRole] = await db
          .select()
          .from(roles)
          .where(eq(roles.slug, 'member'))
          .limit(1);
        if (memberRole) {
          assignRoleId = memberRole.id;
        }
      }

      await db.insert(users).values({
        email: normalizedEmail,
        name: displayName,
        ...(assignRoleId ? { roleId: assignRoleId } : {}),
      });
    }

    // Send email
    await sendOtpEmail(normalizedEmail, code);

    return Ok(undefined);
  } catch (err) {
    console.error('[auth] requestOtp failed:', err);
    return Err(new ValidationError('otpFailed', 'Failed to send verification code. Please try again.'));
  }
}

export async function verifyOtp(email: string, code: string): Promise<Result<void, AuthError>> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!process.env.DATABASE_URL) {
    return Err(new AuthError('configError', 'Database is not configured'));
  }

  try {
    const db = getDb();

    // Look up token
    const [tokenRow] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.email, normalizedEmail))
      .limit(1);

    if (!tokenRow) {
      return Err(new AuthError('expired', 'Verification code has expired'));
    }

    // Check expiry
    if (new Date() > tokenRow.expiresAt) {
      await db.delete(verificationTokens).where(eq(verificationTokens.id, tokenRow.id));
      return Err(new AuthError('expired', 'Verification code has expired'));
    }

    // Check attempts
    if (tokenRow.attempts >= MAX_ATTEMPTS) {
      await db.delete(verificationTokens).where(eq(verificationTokens.id, tokenRow.id));
      return Err(new AuthError('tooManyAttempts', 'Too many failed attempts'));
    }

    // Increment attempts
    await db
      .update(verificationTokens)
      .set({ attempts: tokenRow.attempts + 1 })
      .where(eq(verificationTokens.id, tokenRow.id));

    // Compare hash
    const hashedInput = await hashOtp(code);
    if (hashedInput !== tokenRow.token) {
      const remaining = MAX_ATTEMPTS - (tokenRow.attempts + 1);
      return Err(new AuthError('invalidCode', `Invalid code. ${remaining} attempts remaining`));
    }

    // Success — delete token and create session
    await db.delete(verificationTokens).where(eq(verificationTokens.id, tokenRow.id));

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      return Err(new AuthError('expired', 'User not found'));
    }

    // Resolve the user's role
    let roleId = user.roleId as string | null;
    let roleSlug = '';

    // If user has no role, check for a pending invitation
    if (!roleId) {
      const [invitation] = await db
        .select()
        .from(invitations)
        .where(eq(invitations.email, normalizedEmail))
        .limit(1);

      if (invitation && invitation.status === 'pending') {
        roleId = invitation.roleId;
        // Mark invitation as accepted
        await db
          .update(invitations)
          .set({ status: 'accepted' })
          .where(eq(invitations.id, invitation.id));
        // Assign role to user
        await db
          .update(users)
          .set({ roleId, updatedAt: new Date() })
          .where(eq(users.id, user.id));
      } else {
        // Default to member role
        const [memberRole] = await db
          .select()
          .from(roles)
          .where(eq(roles.slug, 'member'))
          .limit(1);
        if (memberRole) {
          roleId = memberRole.id;
          await db
            .update(users)
            .set({ roleId, updatedAt: new Date() })
            .where(eq(users.id, user.id));
        }
      }
    }

    // Fetch role slug
    if (roleId) {
      const [role] = await db
        .select({ slug: roles.slug })
        .from(roles)
        .where(eq(roles.id, roleId))
        .limit(1);
      if (role) {
        roleSlug = role.slug;
      }
    }

    await createSession(user.id, user.email, roleId ?? '', roleSlug);

    return Ok(undefined);
  } catch (err) {
    console.error('[auth] verifyOtp failed:', err);
    return Err(new AuthError('verifyFailed', 'Verification failed. Please try again.'));
  }
}

export async function signOut(): Promise<void> {
  await clearSession();
  redirect('/login');
}
