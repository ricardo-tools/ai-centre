/**
 * Pre-search — automatically search skills before sending to the model.
 *
 * This provides a grounding safety net: even if the model fails to call
 * search_skills (Qwen3 has ~60% tool-call failure rate), the relevant
 * skills are already in context.
 */

const SKIP_PATTERNS = /^(hi|hello|hey|thanks|thank you|ok|okay|yes|no|sure|bye|goodbye)[\s!.]*$/i;

/** Should we pre-search for this message? Skip trivial greetings. */
export function shouldPreSearch(message: string): boolean {
  return message.trim().length > 3 && !SKIP_PATTERNS.test(message.trim());
}

/** Extract a search query from the user's message by stripping filler words. */
export function extractSearchQuery(message: string): string {
  const filler = /\b(what|which|how|can|do|you|have|i|need|help|me|with|the|a|an|is|are|for|to|about|tell|give|show|find|list|get|please|want|would|like|any|some|all|skills?|skill)\b/gi;
  const cleaned = message.replace(filler, ' ').replace(/[?!.,;:'"]+/g, ' ').replace(/\s+/g, ' ').trim();
  // Return the cleaned query, or the original if stripping removed everything
  return cleaned.length >= 2 ? cleaned : message.trim();
}

interface PreSearchResult {
  slug: string;
  title: string;
  description: string;
  url: string;
}

/** Format pre-search results for injection into the system prompt. */
export function formatPreSearchResults(results: PreSearchResult[]): string {
  if (results.length === 0) return '';
  return results
    .map((s) => `- **${s.title}** (\`${s.slug}\`) — ${s.description} → /skills/${s.slug}`)
    .join('\n');
}
