export class Comment {
  constructor(
    public readonly id: string,
    public readonly text: string,
    public readonly author: string,
    public readonly createdAt: Date,
  ) {}

  get formattedCreatedAt(): string {
    const d = this.createdAt;
    return d.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' }) +
      ', ' + d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
  }
}
