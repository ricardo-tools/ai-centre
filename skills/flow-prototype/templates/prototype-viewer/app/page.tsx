import { getAllProjects } from '../src/acl/project.repository';
import { HomeScreen } from '../src/screens/Home.screen';
import { enAU } from '../src/i18n/en-AU';
import Shell from '../components/Shell';
import ScreenRenderer from '../src/screen-renderer/ScreenRenderer';
import { Folders } from '@phosphor-icons/react/dist/ssr';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const projects = await getAllProjects();
  const config = new HomeScreen(projects);

  return (
    <Shell projects={projects.map((p) => ({ slug: p.slug, name: p.name }))}>
      <div>
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-heading)', lineHeight: 1.2, marginBottom: 'var(--space-1)' }}>
            {enAU.home.title}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>
            {enAU.home.subtitle(projects.length)}
          </p>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            {enAU.home.description}
          </p>
        </div>

        {projects.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)', gap: 'var(--space-3)' }}>
            <Folders size={48} weight="thin" style={{ color: 'var(--color-text-muted)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 'var(--space-1)' }}>
                {enAU.home.emptyTitle}
              </p>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 360 }}>
                {enAU.home.emptyDescription}
              </p>
            </div>
          </div>
        ) : (
          <ScreenRenderer config={config.serialize()} />
        )}
      </div>
    </Shell>
  );
}
