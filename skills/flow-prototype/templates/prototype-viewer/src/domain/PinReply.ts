export class PinReply {
  constructor(
    public readonly id: string,
    public readonly pinId: string,
    public readonly text: string,
    public readonly author: string,
    public readonly createdAt: Date,
  ) {}
}
