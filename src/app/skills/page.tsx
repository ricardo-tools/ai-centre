import { getAllSkills } from '@/lib/skills';
import { SkillCard } from '@/components/SkillCard';

export default function SkillsPage() {
  const skills = getAllSkills();

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>
          Skill Library
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
          Browse and download skills to use with Claude Code.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}
      >
        {skills.map((skill) => (
          <SkillCard
            key={skill.slug}
            slug={skill.slug}
            title={skill.title}
            description={skill.description}
            isOfficial={skill.isOfficial}
            version={skill.version}
          />
        ))}
      </div>
    </div>
  );
}
