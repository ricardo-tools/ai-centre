/**
 * ACL mapper: transforms flat prototype lists into version-grouped sidebar data.
 * Pure function — no React, no framework dependencies.
 */

export interface SidebarPrototype {
  slug: string;
  projectSlug: string;
  name: string;
  agent: string;
  tags: string[];
  updatedAt: string;
  createdAt: string;
}

export interface SidebarGroup {
  version: string;
  label: string;
  items: SidebarPrototype[];
}

/**
 * Groups prototypes by their version tag (v1, v2, etc.) and returns groups
 * sorted with the latest group first.
 *
 * @param prototypes  Flat list of sidebar prototypes
 * @param versionLabels  Map of version tag → human-readable label (from i18n)
 */
export function groupPrototypesByVersion(
  prototypes: SidebarPrototype[],
  versionLabels: Record<string, string>,
): SidebarGroup[] {
  const groupMap = new Map<string, { items: SidebarPrototype[]; maxCreated: number }>();

  for (const proto of prototypes) {
    const vTag = proto.tags.find((t) => /^v\d+$/.test(t)) || 'other';
    let group = groupMap.get(vTag);
    if (!group) {
      group = { items: [], maxCreated: 0 };
      groupMap.set(vTag, group);
    }
    group.items.push(proto);
    const ts = new Date(proto.createdAt).getTime();
    if (ts > group.maxCreated) group.maxCreated = ts;
  }

  const groups: (SidebarGroup & { maxCreated: number })[] = [];
  for (const [version, data] of groupMap) {
    groups.push({
      version,
      label: versionLabels[version] || version,
      items: data.items,
      maxCreated: data.maxCreated,
    });
  }

  // Sort groups: latest first
  groups.sort((a, b) => b.maxCreated - a.maxCreated);

  return groups.map(({ version, label, items }) => ({ version, label, items }));
}
