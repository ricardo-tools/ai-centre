export interface SkillSection {
  title: string;
  level: number;
  content: string;
  codeBlocks: { language: string; code: string }[];
}

export interface ParsedSkill {
  name: string;
  intro: string;
  sections: SkillSection[];
  keyFeatures: string[];
  codeExampleCount: number;
  tableCount: number;
}

export function parseSkillContent(raw: string): ParsedSkill {
  // Strip frontmatter
  const content = raw.replace(/^---[\s\S]*?---\n*/, '');

  const lines = content.split('\n');
  const sections: SkillSection[] = [];
  let currentSection: SkillSection | null = null;
  let name = '';
  let introLines: string[] = [];
  let foundFirstHeading = false;
  let foundSecondHeading = false;

  for (const line of lines) {
    const h1Match = line.match(/^# (.+)/);
    const h2Match = line.match(/^## (.+)/);
    const h3Match = line.match(/^### (.+)/);

    if (h1Match && !foundFirstHeading) {
      name = h1Match[1].trim();
      foundFirstHeading = true;
      continue;
    }

    if ((h2Match || h3Match) && !foundSecondHeading) {
      foundSecondHeading = true;
    }

    if (!foundSecondHeading && foundFirstHeading) {
      introLines.push(line);
      continue;
    }

    if (h2Match) {
      if (currentSection) sections.push(currentSection);
      currentSection = { title: h2Match[1].trim(), level: 2, content: '', codeBlocks: [] };
      continue;
    }

    if (h3Match && currentSection) {
      // h3 content gets appended to the current h2 section
      currentSection.content += `\n### ${h3Match[1]}\n`;
      continue;
    }

    if (currentSection) {
      currentSection.content += line + '\n';
    }
  }

  if (currentSection) sections.push(currentSection);

  // Extract code blocks from each section
  for (const section of sections) {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    let match;
    while ((match = codeBlockRegex.exec(section.content)) !== null) {
      section.codeBlocks.push({ language: match[1] || 'text', code: match[2].trim() });
    }
  }

  // Count totals
  const allContent = content;
  const codeBlockRegex = /```/g;
  const codeMatches = allContent.match(codeBlockRegex);
  const codeExampleCount = codeMatches ? Math.floor(codeMatches.length / 2) : 0;
  const tableCount = (allContent.match(/^\|.+\|$/gm) || []).length;

  // Extract key features (top-level bullet points from intro or first section)
  const intro = introLines.join('\n').trim();
  const bulletRegex = /^[-*] (.+)/gm;
  const keyFeatures: string[] = [];
  let bulletMatch;
  const featureSource = intro || (sections[0]?.content || '');
  while ((bulletMatch = bulletRegex.exec(featureSource)) !== null) {
    const feature = bulletMatch[1].replace(/\*\*/g, '').trim();
    if (feature.length > 10 && feature.length < 120) {
      keyFeatures.push(feature);
    }
    if (keyFeatures.length >= 6) break;
  }

  return { name: name || 'Untitled Skill', intro, sections, keyFeatures, codeExampleCount, tableCount };
}
