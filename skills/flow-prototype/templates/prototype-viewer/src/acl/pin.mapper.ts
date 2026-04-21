import { Pin } from '../domain/Pin';
import { PinReply } from '../domain/PinReply';

/** Shape of a row from the pins table joined with reply count. */
export interface RawPin {
  id: string;
  project_slug: string;
  prototype_slug: string;
  x_percent: number;
  y_percent: number;
  text: string;
  author: string;
  status: string;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  reply_count: number;
}

/** Shape of a row from the pin_replies table. */
export interface RawPinReply {
  id: string;
  pin_id: string;
  text: string;
  author: string;
  created_at: string;
}

export function toPin(raw: RawPin): Pin {
  return new Pin(
    raw.id,
    raw.project_slug,
    raw.prototype_slug,
    raw.x_percent,
    raw.y_percent,
    raw.text,
    raw.author,
    raw.status as 'open' | 'resolved',
    raw.resolved_by,
    raw.resolved_at ? new Date(raw.resolved_at) : null,
    new Date(raw.created_at),
    raw.reply_count,
  );
}

export function toPinReply(raw: RawPinReply): PinReply {
  return new PinReply(
    raw.id,
    raw.pin_id,
    raw.text,
    raw.author,
    new Date(raw.created_at),
  );
}

export function fromPin(pin: Pin): RawPin {
  return {
    id: pin.id,
    project_slug: pin.projectSlug,
    prototype_slug: pin.prototypeSlug,
    x_percent: pin.xPercent,
    y_percent: pin.yPercent,
    text: pin.text,
    author: pin.author,
    status: pin.status,
    resolved_by: pin.resolvedBy,
    resolved_at: pin.resolvedAt?.toISOString() ?? null,
    created_at: pin.createdAt.toISOString(),
    reply_count: pin.replyCount,
  };
}

export function fromPinReply(reply: PinReply): RawPinReply {
  return {
    id: reply.id,
    pin_id: reply.pinId,
    text: reply.text,
    author: reply.author,
    created_at: reply.createdAt.toISOString(),
  };
}
