import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkillShowcaseFallback } from '@/platform/components/SkillShowcaseFallback';
import { ParsedSkillContent } from '@/platform/domain/ParsedSkill';

describe('SkillShowcaseFallback', () => {
  const parsed = new ParsedSkillContent(
    'Test Skill',
    'This is the overview of the test skill.',
    [
      { title: 'Getting Started', level: 2, content: 'First steps here.\n', codeBlocks: [{ language: 'ts', code: 'const x = 1;' }] },
      { title: 'Advanced Usage', level: 2, content: 'More content.\n', codeBlocks: [] },
    ],
    ['Feature A is important', 'Feature B is also important'],
    3,
    5,
  );

  it('renders the overview section', () => {
    render(<SkillShowcaseFallback parsed={parsed} />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText(/overview of the test skill/)).toBeInTheDocument();
  });

  it('renders key capabilities', () => {
    render(<SkillShowcaseFallback parsed={parsed} />);
    expect(screen.getByText('Key Capabilities')).toBeInTheDocument();
    expect(screen.getByText('Feature A is important')).toBeInTheDocument();
    expect(screen.getByText('Feature B is also important')).toBeInTheDocument();
  });

  it('renders section cards', () => {
    render(<SkillShowcaseFallback parsed={parsed} />);
    expect(screen.getByText("What's Inside")).toBeInTheDocument();
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Advanced Usage')).toBeInTheDocument();
  });

  it('shows code block count badge on sections with code', () => {
    render(<SkillShowcaseFallback parsed={parsed} />);
    // "Getting Started" has 1 code block — should show a badge with "1"
    const badges = screen.getAllByText('1');
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it('renders stats footer', () => {
    render(<SkillShowcaseFallback parsed={parsed} />);
    expect(screen.getByText('2 sections')).toBeInTheDocument();
    expect(screen.getByText('3 code examples')).toBeInTheDocument();
  });

  it('handles parsed content with no intro', () => {
    const noIntro = new ParsedSkillContent('Skill', '', [{ title: 'Only Section', level: 2, content: 'Content.\n', codeBlocks: [] }], [], 0, 0);
    render(<SkillShowcaseFallback parsed={noIntro} />);
    expect(screen.queryByText('Overview')).not.toBeInTheDocument();
    expect(screen.getByText('Only Section')).toBeInTheDocument();
  });

  it('handles parsed content with no key features', () => {
    const noFeatures = new ParsedSkillContent('Skill', 'Intro text.', [{ title: 'Section', level: 2, content: 'Content.\n', codeBlocks: [] }], [], 0, 0);
    render(<SkillShowcaseFallback parsed={noFeatures} />);
    expect(screen.queryByText('Key Capabilities')).not.toBeInTheDocument();
  });
});
