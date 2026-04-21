import fs from 'fs';
import path from 'path';
import { Project } from '../domain/Project';
import { toProject, RawProject, type ProjectEnrichment } from './project.mapper';
import { toPrototype, RawPrototype } from './prototype.mapper';
import { Prototype } from '../domain/Prototype';
import { getCommentCount } from './comment.repository';
import { getOpenPinCountForProject } from './pin.repository';
import type { AgentBreakdown, LatestPrototypeInfo } from '../domain/Project';
import type { AgentType } from '../domain/Prototype';

const PROJECTS_DIR = path.join(process.cwd(), 'projects');

export async function getAllProjects(): Promise<Project[]> {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const entries = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true });
  const projects: Project[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const metaPath = path.join(PROJECTS_DIR, entry.name, 'project.json');
    if (!fs.existsSync(metaPath)) continue;

    const raw: RawProject = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    const slugs = getPrototypeSlugs(entry.name);
    const prototypeCount = slugs.length;

    const enrichment = await computeEnrichment(entry.name, slugs);
    projects.push(toProject(entry.name, raw, prototypeCount, enrichment));
  }

  return projects.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function getProject(slug: string): Promise<Project | null> {
  const metaPath = path.join(PROJECTS_DIR, slug, 'project.json');
  if (!fs.existsSync(metaPath)) return null;

  const raw: RawProject = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  const slugs = getPrototypeSlugs(slug);
  const prototypeCount = slugs.length;
  const enrichment = await computeEnrichment(slug, slugs);
  return toProject(slug, raw, prototypeCount, enrichment);
}

export function getProjectBrief(slug: string): string | null {
  const briefPath = path.join(PROJECTS_DIR, slug, 'brief.md');
  if (!fs.existsSync(briefPath)) return null;
  return fs.readFileSync(briefPath, 'utf-8');
}

export function getProjectDecisions(slug: string): string | null {
  const decisionsPath = path.join(PROJECTS_DIR, slug, 'decisions.md');
  if (!fs.existsSync(decisionsPath)) {
    /* Auto-create an empty decisions file so the tab always appears */
    const defaultContent = '# Decisions\n\nNo decisions recorded yet.\n';
    fs.writeFileSync(decisionsPath, defaultContent, 'utf-8');
    return defaultContent;
  }
  return fs.readFileSync(decisionsPath, 'utf-8');
}

export async function getPrototypesForProject(projectSlug: string): Promise<Prototype[]> {
  const projectDir = path.join(PROJECTS_DIR, projectSlug);
  if (!fs.existsSync(projectDir)) return [];

  const slugs = getPrototypeSlugs(projectSlug);
  const prototypes: Prototype[] = [];

  for (const slug of slugs) {
    const metaPath = path.join(projectDir, slug, 'prototype.json');
    const raw: RawPrototype = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    const commentCount = await getCommentCount(projectSlug, slug);
    prototypes.push(toPrototype(slug, projectSlug, raw, commentCount));
  }

  return prototypes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getPrototype(projectSlug: string, protoSlug: string): Promise<Prototype | null> {
  const metaPath = path.join(PROJECTS_DIR, projectSlug, protoSlug, 'prototype.json');
  if (!fs.existsSync(metaPath)) return null;

  const raw: RawPrototype = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  const commentCount = await getCommentCount(projectSlug, protoSlug);
  return toPrototype(protoSlug, projectSlug, raw, commentCount);
}

function getPrototypeSlugs(projectSlug: string): string[] {
  const projectDir = path.join(PROJECTS_DIR, projectSlug);
  if (!fs.existsSync(projectDir)) return [];

  return fs.readdirSync(projectDir, { withFileTypes: true })
    .filter((entry) => {
      if (!entry.isDirectory()) return false;
      return fs.existsSync(path.join(projectDir, entry.name, 'prototype.json'));
    })
    .map((entry) => entry.name);
}

async function computeEnrichment(projectSlug: string, prototypeSlugs: string[]): Promise<ProjectEnrichment> {
  const projectDir = path.join(PROJECTS_DIR, projectSlug);

  // Read all prototype metadata
  const prototypeMetas: { name: string; agent: AgentType; tags: string[]; updatedAt: Date }[] = [];
  for (const slug of prototypeSlugs) {
    const metaPath = path.join(projectDir, slug, 'prototype.json');
    if (!fs.existsSync(metaPath)) continue;
    const raw: RawPrototype = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    prototypeMetas.push({
      name: raw.name,
      agent: raw.agent,
      tags: raw.tags || [],
      updatedAt: new Date(raw.updatedAt),
    });
  }

  // Agent breakdown
  const agentBreakdown: AgentBreakdown = { strict: 0, adaptive: 0, creative: 0 };
  for (const meta of prototypeMetas) {
    if (meta.agent in agentBreakdown) {
      agentBreakdown[meta.agent]++;
    }
  }

  // Version count — unique version tags (e.g. v1, v2, v3)
  const versionSet = new Set<string>();
  for (const meta of prototypeMetas) {
    for (const tag of meta.tags) {
      if (/^v\d+$/i.test(tag)) {
        versionSet.add(tag.toLowerCase());
      }
    }
  }
  const versionCount = versionSet.size;

  // Latest prototype by updatedAt
  let latestPrototype: LatestPrototypeInfo | undefined;
  if (prototypeMetas.length > 0) {
    const sorted = [...prototypeMetas].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    const latest = sorted[0];
    latestPrototype = {
      name: latest.name,
      agent: latest.agent,
      date: latest.updatedAt,
    };
  }

  // Open pin count (async DB query)
  const openPinCount = await getOpenPinCountForProject(projectSlug);

  // Brief excerpt
  let briefExcerpt: string | undefined;
  const briefPath = path.join(projectDir, 'brief.md');
  if (fs.existsSync(briefPath)) {
    const briefContent = fs.readFileSync(briefPath, 'utf-8').trim();
    if (briefContent.length > 0) {
      const plainText = briefContent
        .replace(/^#+\s+.*$/gm, '')
        .replace(/\n{2,}/g, ' ')
        .replace(/\n/g, ' ')
        .trim();
      briefExcerpt = plainText.length > 100 ? plainText.slice(0, 100) + '...' : plainText;
    }
  }

  return {
    agentBreakdown,
    versionCount,
    openPinCount,
    latestPrototype,
    briefExcerpt,
  };
}
