import type { AgentBreakdown } from '../../domain/Project';

export interface ProjectCardProjectData {
  slug: string;
  name: string;
  description: string;
  createdBy: string;
  prototypeCount: number;
  formattedCreatedAt: string;
  formattedUpdatedAt: string;
  agentBreakdown: AgentBreakdown;
  versionCount: number;
  openPinCount: number;
  latestPrototype: {
    name: string;
    agent: string;
    formattedDate: string;
  } | null;
  briefExcerpt: string | null;
}

export interface ProjectCardData {
  project: ProjectCardProjectData;
}

export function useProjectCard(props: { project: ProjectCardProjectData }): ProjectCardData {
  return { project: props.project };
}
