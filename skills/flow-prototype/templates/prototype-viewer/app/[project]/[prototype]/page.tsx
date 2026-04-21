import { notFound } from 'next/navigation';
import { getProject, getPrototype, getPrototypesForProject, getAllProjects } from '../../../src/acl/project.repository';
import PrototypeViewer from './PrototypeViewer';

export const dynamic = 'force-dynamic';

function serializeProject(p: { slug: string; name: string; description: string }) {
  return { slug: p.slug, name: p.name, description: p.description };
}

function serializePrototype(p: {
  slug: string; projectSlug: string; name: string; agent: string;
  shell: string; tags: string[]; commentCount: number;
  updatedAt: Date; createdAt: Date; createdBy: string;
}) {
  return {
    slug: p.slug,
    projectSlug: p.projectSlug,
    name: p.name,
    agent: p.agent,
    shell: p.shell,
    tags: p.tags,
    commentCount: p.commentCount,
    formattedUpdatedAt: p.updatedAt.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' }),
    updatedAt: p.updatedAt.toISOString(),
    createdAt: p.createdAt.toISOString(),
  };
}

export default async function PrototypePage({
  params,
}: {
  params: Promise<{ project: string; prototype: string }>;
}) {
  const { project: projectSlug, prototype: protoSlug } = await params;
  const project = await getProject(projectSlug);
  if (!project) notFound();

  const prototype = await getPrototype(projectSlug, protoSlug);
  if (!prototype) notFound();

  const prototypes = await getPrototypesForProject(projectSlug);

  return (
    <PrototypeViewer
      project={serializeProject(project)}
      prototype={serializePrototype(prototype)}
      prototypes={prototypes.map(serializePrototype)}
      allProjects={(await getAllProjects()).map((p) => ({ slug: p.slug, name: p.name }))}
    />
  );
}
