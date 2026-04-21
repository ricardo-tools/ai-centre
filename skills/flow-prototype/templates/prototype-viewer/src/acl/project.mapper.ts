import { Project } from '../domain/Project';
import type { AgentBreakdown, LatestPrototypeInfo } from '../domain/Project';

export interface RawProject {
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface ProjectEnrichment {
  agentBreakdown: AgentBreakdown;
  versionCount: number;
  openPinCount: number;
  latestPrototype?: LatestPrototypeInfo;
  briefExcerpt?: string;
}

export function toProject(
  slug: string,
  raw: RawProject,
  prototypeCount: number,
  enrichment?: ProjectEnrichment,
): Project {
  return new Project(
    slug,
    raw.name,
    raw.description,
    raw.createdBy,
    new Date(raw.createdAt),
    raw.updatedBy,
    new Date(raw.updatedAt),
    prototypeCount,
    enrichment?.agentBreakdown ?? { strict: 0, adaptive: 0, creative: 0 },
    enrichment?.versionCount ?? 0,
    enrichment?.openPinCount ?? 0,
    enrichment?.latestPrototype,
    enrichment?.briefExcerpt,
  );
}
