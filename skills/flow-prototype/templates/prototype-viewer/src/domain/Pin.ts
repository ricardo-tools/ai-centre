export class Pin {
  constructor(
    public readonly id: string,
    public readonly projectSlug: string,
    public readonly prototypeSlug: string,
    public readonly xPercent: number,
    public readonly yPercent: number,
    public readonly text: string,
    public readonly author: string,
    public readonly status: 'open' | 'resolved',
    public readonly resolvedBy: string | null,
    public readonly resolvedAt: Date | null,
    public readonly createdAt: Date,
    public readonly replyCount: number,
  ) {}
}
