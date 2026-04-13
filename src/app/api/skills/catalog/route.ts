import { NextResponse } from 'next/server';
import { getAllSkills } from '@/platform/lib/skills';

/**
 * GET /api/skills/catalog
 *
 * Returns all skills with metadata (no content bodies).
 * Public endpoint — no auth required. Used by flow-bootstrap
 * to present available skills during project setup.
 */
export async function GET() {
  const skills = getAllSkills();

  const catalog = skills.map((s) => ({
    slug: s.slug,
    title: s.title,
    description: s.description,
    tags: s.tags,
    version: s.version,
    companionTo: s.companionTo ?? null,
  }));

  console.info('[skills-catalog] served catalog', { count: catalog.length });
  return NextResponse.json(catalog);
}
