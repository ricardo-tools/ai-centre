'use server';

import { ARCHETYPES } from '@/lib/archetypes';
import type { RawArchetypeData } from '@/acl/archetype.mapper';

export async function fetchAllArchetypes(): Promise<RawArchetypeData[]> {
  return ARCHETYPES;
}
