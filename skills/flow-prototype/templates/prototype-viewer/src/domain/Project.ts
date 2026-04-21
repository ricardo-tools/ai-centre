import type { AgentType } from './Prototype';

export interface LatestPrototypeInfo {
  name: string;
  agent: AgentType;
  date: Date;
}

export interface AgentBreakdown {
  strict: number;
  adaptive: number;
  creative: number;
}

export class Project {
  constructor(
    public readonly slug: string,
    public readonly name: string,
    public readonly description: string,
    public readonly createdBy: string,
    public readonly createdAt: Date,
    public readonly updatedBy: string,
    public readonly updatedAt: Date,
    public readonly prototypeCount: number,
    public readonly agentBreakdown: AgentBreakdown = { strict: 0, adaptive: 0, creative: 0 },
    public readonly versionCount: number = 0,
    public readonly openPinCount: number = 0,
    public readonly latestPrototype?: LatestPrototypeInfo,
    public readonly briefExcerpt?: string,
  ) {}

  get formattedCreatedAt(): string {
    return this.createdAt.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
  }

  get formattedUpdatedAt(): string {
    return this.updatedAt.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
  }

  get formattedLatestPrototypeDate(): string | null {
    if (!this.latestPrototype) return null;
    return this.latestPrototype.date.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
  }
}
