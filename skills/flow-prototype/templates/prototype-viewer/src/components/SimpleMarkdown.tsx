'use client';

/**
 * Minimal markdown renderer — handles headings, bold, italic, bullets,
 * numbered lists, inline code, and code blocks. No external deps.
 *
 * This is intentionally simple. For full GFM support, add a library later.
 */

interface Props {
  content: string;
}

export default function SimpleMarkdown({ content }: Props) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    /* Code block */
    if (line.trimStart().startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <pre
          key={key++}
          style={{
            background: 'var(--color-code-bg)',
            color: 'var(--color-code-text)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 12,
            lineHeight: 1.6,
            overflowX: 'auto',
            fontFamily: 'var(--font-mono)',
            margin: '8px 0',
          }}
        >
          {codeLines.join('\n')}
        </pre>,
      );
      continue;
    }

    /* Empty line → spacer */
    if (line.trim() === '') {
      elements.push(<div key={key++} style={{ height: 8 }} />);
      i++;
      continue;
    }

    /* Headings */
    const h1Match = line.match(/^# (.+)/);
    if (h1Match) {
      elements.push(
        <h2 key={key++} style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-heading)', margin: '16px 0 8px', lineHeight: 1.3 }}>
          {inlineFormat(h1Match[1])}
        </h2>,
      );
      i++;
      continue;
    }

    const h2Match = line.match(/^## (.+)/);
    if (h2Match) {
      elements.push(
        <h3 key={key++} style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-heading)', margin: '12px 0 6px', lineHeight: 1.3 }}>
          {inlineFormat(h2Match[1])}
        </h3>,
      );
      i++;
      continue;
    }

    const h3Match = line.match(/^### (.+)/);
    if (h3Match) {
      elements.push(
        <h4 key={key++} style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', margin: '8px 0 4px', lineHeight: 1.3 }}>
          {inlineFormat(h3Match[1])}
        </h4>,
      );
      i++;
      continue;
    }

    /* Unordered list item */
    const ulMatch = line.match(/^[-*] (.+)/);
    if (ulMatch) {
      elements.push(
        <div key={key++} style={{ display: 'flex', gap: 8, marginLeft: 8, lineHeight: 1.6 }}>
          <span style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>•</span>
          <span>{inlineFormat(ulMatch[1])}</span>
        </div>,
      );
      i++;
      continue;
    }

    /* Numbered list item */
    const olMatch = line.match(/^(\d+)\. (.+)/);
    if (olMatch) {
      elements.push(
        <div key={key++} style={{ display: 'flex', gap: 8, marginLeft: 8, lineHeight: 1.6 }}>
          <span style={{ color: 'var(--color-text-muted)', flexShrink: 0, minWidth: 16, textAlign: 'right' }}>{olMatch[1]}.</span>
          <span>{inlineFormat(olMatch[2])}</span>
        </div>,
      );
      i++;
      continue;
    }

    /* Regular paragraph */
    elements.push(
      <p key={key++} style={{ margin: '4px 0', lineHeight: 1.6 }}>
        {inlineFormat(line)}
      </p>,
    );
    i++;
  }

  return <div>{elements}</div>;
}

/** Handle inline markdown: **bold**, *italic*, `code` */
function inlineFormat(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let k = 0;

  while (remaining.length > 0) {
    /* Bold */
    const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)/);
    if (boldMatch) {
      if (boldMatch[1]) parts.push(boldMatch[1]);
      parts.push(<strong key={k++} style={{ fontWeight: 600 }}>{boldMatch[2]}</strong>);
      remaining = boldMatch[3];
      continue;
    }

    /* Italic */
    const italicMatch = remaining.match(/^(.*?)\*(.+?)\*(.*)/);
    if (italicMatch) {
      if (italicMatch[1]) parts.push(italicMatch[1]);
      parts.push(<em key={k++}>{italicMatch[2]}</em>);
      remaining = italicMatch[3];
      continue;
    }

    /* Inline code */
    const codeMatch = remaining.match(/^(.*?)`(.+?)`(.*)/);
    if (codeMatch) {
      if (codeMatch[1]) parts.push(codeMatch[1]);
      parts.push(
        <code
          key={k++}
          style={{
            background: 'var(--color-code-bg)',
            color: 'var(--color-code-text)',
            padding: '1px 4px',
            borderRadius: 3,
            fontSize: '0.9em',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {codeMatch[2]}
        </code>,
      );
      remaining = codeMatch[3];
      continue;
    }

    /* No more matches */
    parts.push(remaining);
    break;
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}
