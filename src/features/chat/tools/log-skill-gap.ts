/**
 * Tool: log_skill_gap
 *
 * Logs a skill gap when the assistant identifies that no existing skill
 * covers what the user needs. Inserts into skill_gaps table for triage.
 */

import { getDb, hasDatabase } from '@/platform/db/client';
import { skillGaps } from '@/platform/db/schema';

export const logSkillGapDefinition = {
  type: 'function' as const,
  function: {
    name: 'log_skill_gap',
    description:
      'Log a skill gap when the user needs something that no existing skill covers. ' +
      'Use this whenever you tell the user "We don\'t currently have a skill for that."',
    parameters: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'What the user needed — a concise description of the missing skill',
        },
        userQuery: {
          type: 'string',
          description: 'The original user question or request',
        },
      },
      required: ['description', 'userQuery'],
    },
  },
};

interface LogSkillGapArgs {
  description: string;
  userQuery: string;
  conversationId?: string;
  userId?: string;
}

export async function executeLogSkillGap(args: LogSkillGapArgs): Promise<string> {
  if (!hasDatabase()) {
    return JSON.stringify({ error: 'Database not configured' });
  }

  try {
    const db = getDb();
    const [row] = await db
      .insert(skillGaps)
      .values({
        description: args.description,
        userQuery: args.userQuery,
        conversationId: args.conversationId ?? null,
        userId: args.userId ?? null,
      })
      .returning();

    return JSON.stringify({
      ok: true,
      gapId: (row as { id: string }).id,
      message: `Skill gap logged: "${args.description}". The team will review this for a future skill.`,
    });
  } catch (err) {
    console.error('[log_skill_gap] Failed to log skill gap:', err);
    return JSON.stringify({ error: `Failed to log skill gap: ${String(err)}` });
  }
}
