'use client';

import { useState, useEffect } from 'react';
import { Skill } from '@/platform/domain/Skill';
import { ParsedSkillContent } from '@/platform/domain/ParsedSkill';
import { fetchSkillWithParsed } from '@/features/skill-library/action';
import type { SkillReference } from '@/features/skill-library/action';
import { toSkill } from '@/platform/acl/skill.mapper';
import { toParsedSkillContent } from '@/platform/acl/parsed-skill.mapper';

interface UseSkillDetailOptions {
  slug: string;
  mock?: boolean;
}

interface UseSkillDetailResult {
  skill: Skill | null;
  parsed: ParsedSkillContent | null;
  references: SkillReference[];
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
    { type: 'principle', domain: ['global'], layer: 'fullstack' },
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
  const [references, setReferences] = useState<SkillReference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mock) {
      setSkill(createMockSkill());
      setParsed(createMockParsed());
      setReferences([]);
      setLoading(false);
      return;
    }

    fetchSkillWithParsed(slug).then((result) => {
      if (result.ok) {
        setSkill(toSkill(result.value.skill));
        setParsed(toParsedSkillContent(result.value.parsed));
        setReferences(result.value.references);
      }
      setLoading(false);
    });
  }, [slug, mock]);

  return { skill, parsed, references, loading };
}
