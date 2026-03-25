/**
 * Post-response validation — scan AI responses for invalid skill references.
 *
 * Catches hallucinated /skills/ URLs that slipped through despite the catalog
 * and pre-search grounding. Strips invalid URLs rather than showing broken links.
 */

/** Scan response for /skills/ URLs and validate against known slugs. */
export function validateSkillReferences(
  response: string,
  validSlugs: Set<string>,
): { cleaned: string; invalidRefs: string[] } {
  const invalidRefs: string[] = [];

  // Match markdown links: [text](/skills/slug) and plain URLs: /skills/slug
  const cleaned = response.replace(
    /\[([^\]]+)\]\(\/skills\/([a-z0-9-]+)\)/g,
    (match, text, slug) => {
      if (validSlugs.has(slug)) return match;
      invalidRefs.push(slug);
      return text; // Strip the link, keep the text
    },
  ).replace(
    /(?<!\()\/skills\/([a-z0-9-]+)(?!\))/g,
    (match, slug) => {
      if (validSlugs.has(slug)) return match;
      invalidRefs.push(slug);
      return ''; // Strip bare invalid URLs
    },
  );

  return { cleaned, invalidRefs };
}
