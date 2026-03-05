'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SkillShowcaseProps {
  content: string;
}

export function SkillShowcase({ content }: SkillShowcaseProps) {
  // Strip the YAML frontmatter if present
  const stripped = content.replace(/^---[\s\S]*?---\n*/, '');

  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {stripped}
      </ReactMarkdown>
    </div>
  );
}
