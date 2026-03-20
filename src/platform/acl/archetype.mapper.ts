import { Archetype } from '@/platform/domain/Archetype';

/** Raw shape from the data layer (src/lib/archetypes.ts). */
export interface RawArchetypeData {
  slug: string;
  title: string;
  description: string;
  skills: string[];
  icon: string;
}

export function toArchetype(raw: RawArchetypeData): Archetype {
  return new Archetype(raw.slug, raw.title, raw.description, raw.skills, raw.icon);
}

export function toArchetypes(rawList: RawArchetypeData[]): Archetype[] {
  return rawList.map(toArchetype);
}
