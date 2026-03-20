export interface SlideStats {
  value: string;
  label: string;
  color?: string;
  iconName?: string;
}

export interface Slide {
  type: 'title' | 'content' | 'split' | 'quote' | 'section' | 'stats' | 'closing';
  layout?: 'numbered' | 'highlight';
  kicker?: string;
  title?: string;
  subtitle?: string;
  bullets?: string[];
  quote?: string;
  attribution?: string;
  emoji?: string;
  stats?: SlideStats[];
}
