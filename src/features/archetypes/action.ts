'use server';

import { ARCHETYPES } from '@/platform/lib/archetypes';
import type { RawArchetypeData } from '@/platform/acl/archetype.mapper';
import { type Result, Ok } from '@/platform/lib/result';

export async function fetchAllArchetypes(): Promise<Result<RawArchetypeData[], Error>> {
  return Ok(ARCHETYPES);
}
