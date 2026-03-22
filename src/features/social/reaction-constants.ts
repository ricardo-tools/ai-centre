export const ALLOWED_EMOJIS = ['thumbsup', 'heart', 'rocket', 'eyes', 'tada'] as const;
export type Emoji = (typeof ALLOWED_EMOJIS)[number];

export const EMOJI_DISPLAY: Record<Emoji, string> = {
  thumbsup: '\u{1F44D}',
  heart: '\u2764\uFE0F',
  rocket: '\u{1F680}',
  eyes: '\u{1F440}',
  tada: '\u{1F389}',
};
