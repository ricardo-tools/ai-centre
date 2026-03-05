export interface ArchetypeData {
  slug: string;
  title: string;
  description: string;
  skills: string[];
  icon: string;
}

export const ARCHETYPES: ArchetypeData[] = [
  {
    slug: 'presentation',
    title: 'Presentation',
    description: 'Generate standalone HTML/JS presentations with keyboard navigation, fullscreen mode, themed slides, and PPTX export via PptxGenJS.',
    skills: ['brand-design-system', 'design-excellence', 'presentation'],
    icon: '📊',
  },
];

export function getArchetypeBySlug(slug: string): ArchetypeData | undefined {
  return ARCHETYPES.find((a) => a.slug === slug);
}
