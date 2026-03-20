'use client';

import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

interface CodeBlockProps {
  children: string;
  /** Language for syntax highlighting. Defaults to 'text' (no highlighting). */
  language?: string;
  /** Short description shown in the top bar (left side). e.g. "Good — guard clauses" */
  title?: string;
}

const LANGUAGE_LABELS: Record<string, string> = {
  ts: 'TypeScript',
  tsx: 'TSX',
  typescript: 'TypeScript',
  js: 'JavaScript',
  jsx: 'JSX',
  javascript: 'JavaScript',
  css: 'CSS',
  html: 'HTML',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  bash: 'Bash',
  sh: 'Shell',
  sql: 'SQL',
  graphql: 'GraphQL',
  markdown: 'Markdown',
  md: 'Markdown',
  text: 'Plain text',
};

function getLabel(lang: string): string {
  return LANGUAGE_LABELS[lang] ?? lang.toUpperCase();
}

/**
 * Reusable code block with syntax highlighting via Shiki.
 *
 * Usage:
 *   <CodeBlock language="tsx" title="Domain object">{`class Skill { ... }`}</CodeBlock>
 *   <CodeBlock language="bash">{`npm install`}</CodeBlock>
 *   <CodeBlock>{`plain text`}</CodeBlock>
 */
export function CodeBlock({ children, language = 'text', title }: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);
  const trimmed = children.trim();
  const showBar = title || language !== 'text';

  useEffect(() => {
    let cancelled = false;

    if (language === 'text') {
      setHtml(null);
      return;
    }

    codeToHtml(trimmed, {
      lang: language,
      themes: {
        light: 'github-light-default',
        dark: 'github-dark-default',
      },
      defaultColor: false,
    })
      .then((result) => {
        if (!cancelled) setHtml(result);
      })
      .catch(() => {
        if (!cancelled) setHtml(null);
      });

    return () => { cancelled = true; };
  }, [trimmed, language]);

  return (
    <div
      style={{
        borderRadius: 8,
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        marginBottom: 4,
      }}
    >
      {/* Top bar */}
      {showBar && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 12px',
            background: 'var(--color-bg-alt)',
            borderBottom: '1px solid var(--color-border)',
            minHeight: 28,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--color-text-muted)',
            }}
          >
            {title ?? ''}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: 3,
              background: 'var(--color-primary-muted)',
              color: 'var(--color-primary)',
              letterSpacing: '0.03em',
            }}
          >
            {getLabel(language)}
          </span>
        </div>
      )}

      {/* Code content */}
      {html ? (
        <div
          className="shiki-wrapper"
          dangerouslySetInnerHTML={{ __html: html }}
          style={{
            fontSize: 13,
            lineHeight: 1.7,
            overflow: 'auto',
          }}
        />
      ) : (
        <pre
          style={{
            fontSize: 13,
            fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace",
            lineHeight: 1.7,
            padding: 16,
            background: 'var(--color-bg-alt)',
            overflow: 'auto',
            margin: 0,
            color: 'var(--color-text-body)',
          }}
        >
          {trimmed}
        </pre>
      )}
    </div>
  );
}
