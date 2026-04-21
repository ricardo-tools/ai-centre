import type { AppShell } from './types';

export type AgentType = 'strict' | 'adaptive' | 'creative';

export class Prototype {
  constructor(
    public readonly slug: string,
    public readonly projectSlug: string,
    public readonly name: string,
    public readonly agent: AgentType,
    public readonly shell: AppShell,
    public readonly tags: string[],
    public readonly createdBy: string,
    public readonly createdAt: Date,
    public readonly updatedBy: string,
    public readonly updatedAt: Date,
    public readonly commentCount: number,
  ) {}

  get formattedUpdatedAt(): string {
    return this.updatedAt.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
  }

  get commentKey(): string {
    return `${this.projectSlug}/${this.slug}`;
  }
}
