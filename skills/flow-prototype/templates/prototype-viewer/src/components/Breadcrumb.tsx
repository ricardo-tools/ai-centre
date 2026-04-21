import Link from 'next/link';
import { CaretRight } from '@phosphor-icons/react/dist/ssr';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, minWidth: 0 }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {i > 0 && <CaretRight size={10} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />}
          {item.href && !item.active ? (
            <Link
              href={item.href}
              style={{
                color: 'var(--color-text-muted)',
                fontWeight: 400,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.label}
            </Link>
          ) : (
            <span
              style={{
                color: item.active ? 'var(--color-text-heading)' : 'var(--color-text-muted)',
                fontWeight: item.active ? 600 : 400,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
