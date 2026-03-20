import Mailgun from 'mailgun.js';
import FormData from 'form-data';

function getMailgunClient() {
  const apiKey = process.env.MAILGUN_API_KEY;
  if (!apiKey) {
    return null;
  }
  const mailgun = new Mailgun(FormData);
  return mailgun.client({
    username: 'api',
    key: apiKey,
    url: process.env.MAILGUN_EU === 'true' ? 'https://api.eu.mailgun.net' : undefined,
  });
}

function getFromEmail(): string {
  if (process.env.MAILGUN_FROM_EMAIL) {
    return process.env.MAILGUN_FROM_EMAIL;
  }
  const domain = process.env.MAILGUN_DOMAIN;
  return `AI Centre <noreply@${domain}>`;
}

function buildOtpEmailHtml(code: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#F4F4F8;font-family:'Jost',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F8;padding:48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:440px;background:#FFFFFF;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#1A1B2E;padding:32px 32px 24px;text-align:center;">
              <div style="font-size:20px;font-weight:700;color:#FFFFFF;letter-spacing:0.5px;">AI Centre</div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 32px 16px;text-align:center;">
              <div style="font-size:16px;font-weight:500;color:#6B6E80;margin-bottom:8px;">Your verification code</div>
            </td>
          </tr>
          <!-- Code -->
          <tr>
            <td style="padding:0 32px;text-align:center;">
              <div style="display:inline-block;background:#F4F4F8;border:2px solid #E2E3EB;border-radius:12px;padding:20px 32px;margin:0 auto;">
                <span style="font-family:'Courier New',monospace;font-size:36px;font-weight:700;letter-spacing:8px;color:#1A1B2E;">${code}</span>
              </div>
            </td>
          </tr>
          <!-- Instructions -->
          <tr>
            <td style="padding:24px 32px 8px;text-align:center;">
              <div style="font-size:15px;color:#6B6E80;line-height:1.5;">
                Enter this code in the login page to verify your identity.
              </div>
            </td>
          </tr>
          <!-- Expiry -->
          <tr>
            <td style="padding:8px 32px 40px;text-align:center;">
              <div style="font-size:13px;color:#9395A5;">
                This code expires in 10 minutes.
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #E2E3EB;text-align:center;">
              <div style="font-size:12px;color:#9395A5;line-height:1.5;">
                If you didn't request this code, you can safely ignore this email.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  const mg = getMailgunClient();

  if (!mg) {
    console.log(`[dev] sendOtpEmail to=${email} code=${code}`);
    return;
  }

  const domain = process.env.MAILGUN_DOMAIN;
  if (!domain) {
    throw new Error('MAILGUN_DOMAIN is not set');
  }

  await mg.messages.create(domain, {
    from: getFromEmail(),
    to: [email],
    subject: `${code} — Your AI Centre verification code`,
    html: buildOtpEmailHtml(code),
  });
}

function buildInviteEmailHtml(inviterName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#F4F4F8;font-family:'Jost',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F8;padding:48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:440px;background:#FFFFFF;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#1A1B2E;padding:32px 32px 24px;text-align:center;">
              <div style="font-size:20px;font-weight:700;color:#FFFFFF;letter-spacing:0.5px;">AI Centre</div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 32px 16px;text-align:center;">
              <div style="font-size:16px;font-weight:500;color:#6B6E80;margin-bottom:8px;">You've been invited!</div>
            </td>
          </tr>
          <!-- Message -->
          <tr>
            <td style="padding:0 32px;text-align:center;">
              <div style="font-size:18px;font-weight:600;color:#1A1B2E;line-height:1.5;">
                ${inviterName} has invited you to join AI Centre.
              </div>
            </td>
          </tr>
          <!-- Description -->
          <tr>
            <td style="padding:24px 32px 8px;text-align:center;">
              <div style="font-size:15px;color:#6B6E80;line-height:1.5;">
                AI Centre is your team's hub for AI-assisted project generation and skill management. Click below to get started.
              </div>
            </td>
          </tr>
          <!-- CTA Button -->
          <tr>
            <td style="padding:24px 32px 40px;text-align:center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" style="display:inline-block;background:#1A1B2E;color:#FFFFFF;font-size:16px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:10px;">
                Get Started
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px;border-top:1px solid #E2E3EB;text-align:center;">
              <div style="font-size:12px;color:#9395A5;line-height:1.5;">
                If you weren't expecting this invitation, you can safely ignore this email.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendInviteEmail(email: string, inviterName: string): Promise<void> {
  const mg = getMailgunClient();

  if (!mg) {
    console.log(`[dev] sendInviteEmail: ${email} invited by ${inviterName}`);
    return;
  }

  const domain = process.env.MAILGUN_DOMAIN;
  if (!domain) {
    throw new Error('MAILGUN_DOMAIN is not set');
  }

  await mg.messages.create(domain, {
    from: getFromEmail(),
    to: [email],
    subject: `You've been invited to AI Centre`,
    html: buildInviteEmailHtml(inviterName),
  });
}
