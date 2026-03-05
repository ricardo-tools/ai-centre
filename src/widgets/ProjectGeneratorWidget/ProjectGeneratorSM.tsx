'use client';

import { useState, useEffect } from 'react';
import { CheckSquare, Square, Rocket, Package } from '@phosphor-icons/react';
import { useLocale } from '@/screen-renderer/LocaleContext';
import type { Skill } from '@/domain/Skill';
import type { Archetype } from '@/domain/Archetype';

interface ProjectGeneratorSMProps {
  skills: Skill[];
  archetypes: Archetype[];
}

export function ProjectGeneratorSM({ skills, archetypes }: ProjectGeneratorSMProps) {
  const { t } = useLocale();
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('archetype');
    if (slug) {
      const found = archetypes.find((a) => a.slug === slug);
      if (found) {
        setSelectedArchetype(found.slug);
        setSelectedSkills(new Set(found.skills));
      }
    }
  }, [archetypes]);

  const handleSelectArchetype = (slug: string) => {
    const arch = archetypes.find((a) => a.slug === slug);
    if (!arch) return;
    if (selectedArchetype === slug) {
      setSelectedArchetype(null);
      setSelectedSkills(new Set());
    } else {
      setSelectedArchetype(slug);
      setSelectedSkills(new Set(arch.skills));
    }
  };

  const toggleSkill = (slug: string) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const handleGenerate = async () => {
    if (selectedSkills.size === 0) return;
    setIsGenerating(true);
    try {
      const { generateProjectZip } = await import('@/lib/generate-project-zip');
      const archetype = archetypes.find((a) => a.slug === selectedArchetype);
      const selectedSkillData = skills.filter((s) => selectedSkills.has(s.slug));

      const blob = await generateProjectZip({
        archetypeName: archetype?.title || 'Custom Project',
        archetypeDescription: archetype?.description || 'A custom project with selected skills.',
        selectedSkills: selectedSkillData,
        userDescription: description,
        includeTemplate: selectedArchetype === 'presentation',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedArchetype || 'project'}-skills.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  };

  const stepHeadingStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <div style={{ padding: 16, maxWidth: 480 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>
        {t('generate.title')}
      </h1>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 20 }}>
        {t('generate.subtitle')}
      </p>

      {/* Step 1: Archetype */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={stepHeadingStyle}>{t('generate.step1')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
          {archetypes.map((a) => {
            const isSelected = selectedArchetype === a.slug;
            return (
              <button
                key={a.slug}
                onClick={() => handleSelectArchetype(a.slug)}
                style={{
                  padding: 12,
                  borderRadius: 6,
                  border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: isSelected ? 'var(--color-primary-muted)' : 'var(--color-surface)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ fontSize: 22 }}>{a.icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 2px' }}>{a.title}</p>
                  <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.3 }}>{a.description}</p>
                </div>
              </button>
            );
          })}
          <button
            onClick={() => { setSelectedArchetype(null); setSelectedSkills(new Set()); }}
            style={{
              padding: 12,
              borderRadius: 6,
              border: selectedArchetype === null ? '2px solid var(--color-primary)' : '1px dashed var(--color-border)',
              background: selectedArchetype === null ? 'var(--color-primary-muted)' : 'var(--color-surface)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: 'inherit',
            }}
          >
            <Package size={22} color="var(--color-text-muted)" />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 2px' }}>{t('generate.custom')}</p>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>{t('generate.customDescription')}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Step 2: Skills */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={stepHeadingStyle}>{t('generate.step2')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {skills.map((s) => {
            const checked = selectedSkills.has(s.slug);
            const Icon = checked ? CheckSquare : Square;
            return (
              <button
                key={s.slug}
                onClick={() => toggleSkill(s.slug)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: checked ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: checked ? 'var(--color-primary-muted)' : 'var(--color-surface)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  width: '100%',
                }}
              >
                <Icon size={16} weight={checked ? 'fill' : 'regular'} color={checked ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{s.title}</span>
                  {s.isOfficial && (
                    <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: 'var(--color-success-muted)', color: 'var(--color-success)', fontWeight: 600, marginLeft: 6 }}>
                      {t('skills.official')}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Description */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={stepHeadingStyle}>{t('generate.step3')}</h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('generate.placeholder')}
          style={{
            width: '100%',
            minHeight: 80,
            padding: 12,
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-body)',
            fontFamily: 'inherit',
            fontSize: 12,
            lineHeight: 1.4,
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={selectedSkills.size === 0 || isGenerating}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 20px',
          borderRadius: 6,
          border: 'none',
          background: selectedSkills.size === 0 ? 'var(--color-border)' : 'var(--color-primary)',
          color: selectedSkills.size === 0 ? 'var(--color-text-muted)' : '#fff',
          fontSize: 13,
          fontWeight: 600,
          cursor: selectedSkills.size === 0 ? 'default' : 'pointer',
          fontFamily: 'inherit',
          opacity: isGenerating ? 0.7 : 1,
        }}
      >
        <Rocket size={16} weight="fill" />
        {isGenerating ? t('generate.generating') : t('generate.button')}
      </button>

      {selectedSkills.size > 0 && (
        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8 }}>
          {t('generate.includes', { count: selectedSkills.size, plural: selectedSkills.size > 1 ? 's' : '' })}
          {selectedArchetype === 'presentation' ? t('generate.includesTemplate') : ''}
        </p>
      )}
    </div>
  );
}
