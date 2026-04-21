import { Prototype } from '../domain/Prototype';
import type { AppShell } from '../domain/types';

export interface RawPrototype {
  name: string;
  agent: 'strict' | 'adaptive' | 'creative';
  shell?: string;
  tags?: string[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export function toPrototype(
  slug: string,
  projectSlug: string,
  raw: RawPrototype,
  commentCount: number,
): Prototype {
  return new Prototype(
    slug,
    projectSlug,
    raw.name,
    raw.agent,
    (raw.shell || 'ezycollect-legacy') as AppShell,
    raw.tags || [],
    raw.createdBy,
    new Date(raw.createdAt),
    raw.updatedBy,
    new Date(raw.updatedAt),
    commentCount,
  );
}
