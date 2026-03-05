'use client';

import { useState, useEffect } from 'react';
import { Skill } from '@/domain/Skill';
import { ParsedSkillContent } from '@/domain/ParsedSkill';
import { fetchSkillWithParsed } from '@/server/actions/skills';
import { toSkill } from '@/acl/skill.mapper';
import { toParsedSkillContent } from '@/acl/parsed-skill.mapper';

interface UseSkillDetailOptions {
  slug: string;
  mock?: boolean;
}

interface UseSkillDetailResult {
  skill: Skill | null;
  parsed: ParsedSkillContent | null;
  loading: boolean;
}

function createMockSkill(): Skill {
  return new Skill(
    'mock-skill',
    'Mock Skill',
    'A mock skill for development and testing purposes with detailed content.',
    true,
    '1.0.0',
    '# Mock Skill\n\nIntro paragraph.\n\n## Section One\n\nContent here.\n\n```ts\nconst x = 1;\n```\n\n## Section Two\n\n| Col | Val |\n|---|---|\n| A | 1 |\n',
  );
}

function createMockParsed(): ParsedSkillContent {
  return new ParsedSkillContent(
    'Mock Skill',
    'A mock skill for development and testing purposes.',
    [
      { title: 'Section One', level: 2, content: 'Content here.\n', codeBlocks: [{ language: 'ts', code: 'const x = 1;' }] },
      { title: 'Section Two', level: 2, content: '| Col | Val |\n|---|---|\n| A | 1 |\n', codeBlocks: [] },
    ],
    ['Detailed content coverage', 'Code example patterns'],
    1,
    3,
  );
}

export function useSkillDetail({ slug, mock }: UseSkillDetailOptions): UseSkillDetailResult {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [parsed, setParsed] = useState<ParsedSkillContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mock) {
      setSkill(createMockSkill());
      setParsed(createMockParsed());
      setLoading(false);
      return;
    }

    fetchSkillWithParsed(slug).then((result) => {
      if (result) {
        setSkill(toSkill(result.skill));
        setParsed(toParsedSkillContent(result.parsed));
      }
      setLoading(false);
    });
  }, [slug, mock]);

  return { skill, parsed, loading };
}
