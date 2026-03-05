import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export interface SkillData {
  slug: string;
  title: string;
  description: string;
  isOfficial: boolean;
  version: string;
  content: string;
}

const SKILL_DEFINITIONS: Omit<SkillData, 'content'>[] = [
  {
    slug: 'app-layout',
    title: 'App Layout',
    description: 'Shell layout patterns (TopBar+Sidebar, TopBar+MegaMenus, SidebarOnly, Minimal) with responsive grid configs, navigation widgets, and spacing principles.',
    isOfficial: true,
    version: '1.0.0',
  },
  {
    slug: 'brand-design-system',
    title: 'Brand Design System',
    description: 'Brand color palette, typography, logo, favicon, semantic design tokens, theming (Light, Dark, Night, Legacy), Phosphor Icons, and asset libraries.',
    isOfficial: true,
    version: '1.0.0',
  },
  {
    slug: 'design-excellence',
    title: 'Design Excellence',
    description: 'Visual hierarchy, 8px spacing system, negative space, alignment, element interactions, consistency, and attention to detail — medium-agnostic design principles.',
    isOfficial: true,
    version: '1.0.0',
  },
  {
    slug: 'frontend-architecture',
    title: 'Frontend Architecture',
    description: '7-layer architecture (Components, Widgets, Domain Objects, ACL, Screen Renderer, Slots), CSS custom property styling, grid system, and TypeScript conventions.',
    isOfficial: true,
    version: '1.0.0',
  },
  {
    slug: 'presentation',
    title: 'Presentation',
    description: 'Standalone HTML/JS presentation builder with keyboard/click navigation, fullscreen mode, themed slides, footer bar, and PptxGenJS-based PPTX export.',
    isOfficial: true,
    version: '1.0.0',
  },
  {
    slug: 'print-design',
    title: 'Print Design',
    description: 'Print-ready design standards: 3-zone system (bleed/trim/safe), export requirements (PDF, 300+ DPI), typography for print, QR codes, and pre-flight checklist.',
    isOfficial: true,
    version: '1.0.0',
  },
];

function getProjectRoot(): string {
  return resolve(process.cwd());
}

export function getAllSkills(): SkillData[] {
  const root = getProjectRoot();
  return SKILL_DEFINITIONS.map((skill) => {
    const filePath = resolve(root, skill.slug, 'SKILL.md');
    const content = existsSync(filePath) ? readFileSync(filePath, 'utf-8') : '';
    return { ...skill, content };
  });
}

export function getSkillBySlug(slug: string): SkillData | null {
  const root = getProjectRoot();
  const definition = SKILL_DEFINITIONS.find((s) => s.slug === slug);
  if (!definition) return null;

  const filePath = resolve(root, slug, 'SKILL.md');
  const content = existsSync(filePath) ? readFileSync(filePath, 'utf-8') : '';
  return { ...definition, content };
}
