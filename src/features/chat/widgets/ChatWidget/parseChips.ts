/**
 * Parses continuation-option chips and fun-fact markers from assistant messages.
 *
 * Chips:  <!-- chips: ["Option A", "Option B", "Option C"] -->
 * Facts:  <!-- fact: Did you know that today in 1849, ... -->
 */
export interface ParsedMessage {
  /** Message content with chips and fact comments stripped. */
  content: string;
  /** Extracted chip labels. Empty array if none found. */
  chips: string[];
  /** Extracted fun fact text, or null if none found. */
  fact: string | null;
}

/** @deprecated Use ParsedMessage instead */
export type ParsedChips = ParsedMessage;

const CHIPS_PATTERN = /<!--\s*chips:\s*(\[[\s\S]*?\])\s*-->\s*$/;
const FACT_PATTERN = /<!--\s*fact:\s*([\s\S]*?)\s*-->/;

export function parseChips(raw: string): ParsedMessage {
  let content = raw;
  let chips: string[] = [];
  let fact: string | null = null;

  // Extract chips — only strip the comment if JSON parses into a valid string array
  const chipsMatch = CHIPS_PATTERN.exec(content);
  if (chipsMatch) {
    try {
      const parsed: unknown = JSON.parse(chipsMatch[1]);
      if (Array.isArray(parsed) && parsed.every((v) => typeof v === 'string')) {
        chips = parsed as string[];
        content = content.slice(0, chipsMatch.index).trimEnd();
      }
    } catch { /* keep content intact */ }
  }

  // Extract fact
  const factMatch = FACT_PATTERN.exec(content);
  if (factMatch) {
    fact = factMatch[1].trim();
    content = (content.slice(0, factMatch.index) + content.slice(factMatch.index + factMatch[0].length)).trim();
  }

  return { content, chips, fact };
}
