import { ParsedSkillContent } from '@/domain/ParsedSkill';
import type { ParsedSkill as RawParsedSkill } from '@/lib/parse-skill';

export function toParsedSkillContent(raw: RawParsedSkill): ParsedSkillContent {
  return new ParsedSkillContent(
    raw.name,
    raw.intro,
    raw.sections,
    raw.keyFeatures,
    raw.codeExampleCount,
    raw.tableCount,
  );
}
