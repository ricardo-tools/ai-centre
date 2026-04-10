'use client';

import { useState } from 'react';
import { CheckSquare, Square, Rocket, Package } from '@phosphor-icons/react';
import { useLocale } from '@/platform/screen-renderer/LocaleContext';
import type { Skill } from '@/platform/domain/Skill';
import type { Archetype } from '@/platform/domain/Archetype';
import { generateProject } from '@/features/generate-project/action';

interface ProjectGeneratorXSProps {
  skills: Skill[];
  archetypes: Archetype[];
}

export function ProjectGeneratorXS({ skills, archetypes }: ProjectGeneratorXSProps) {
  const { t } = useLocale();
  const [activeStep, setActiveStep] = useState(1);
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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
      const result = await generateProject({
        domainSlug: selectedArchetype || 'custom',
        resolvedSkills: Array.from(selectedSkills),
        description,
      });

      if (!result.ok) throw result.error;

      const bytes = Uint8Array.from(atob(result.value.zipBase64), c => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.value.fileName;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  };

  const stepHeaderStyle = (step: number): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    borderRadius: 6,
    border: activeStep === step ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
    background: activeStep === step ? 'var(--color-primary-muted)' : 'var(--color-surface)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--color-text-heading)',
    marginBottom: activeStep === step ? 8 : 0,
    width: '100%',
  });

  return (
    <div style={{ padding: 12, maxWidth: '100%', width: '100%' }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-heading)', margin: '0 0 12px' }}>
        {t('generate.title')}
      </h1>

      {/* Step 1 */}
      <div style={{ marginBottom: 8 }}>
        <button onClick={() => setActiveStep(1)} style={stepHeaderStyle(1)}>
          {t('generate.step1')}
        </button>
        {activeStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
            {archetypes.map((a) => {
              const isSelected = selectedArchetype === a.slug;
              return (
                <button
                  key={a.slug}
                  onClick={() => { handleSelectArchetype(a.slug); setActiveStep(2); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    background: isSelected ? 'var(--color-primary-muted)' : 'var(--color-surface)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    width: '100%',
                  }}
                >
                  <span style={{ fontSize: 20 }}>{a.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{a.title}</span>
                </button>
              );
            })}
            <button
              onClick={() => { setSelectedArchetype(null); setSelectedSkills(new Set()); setActiveStep(2); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px dashed var(--color-border)',
                background: 'var(--color-surface)',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                width: '100%',
              }}
            >
              <Package size={20} color="var(--color-text-muted)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{t('generate.custom')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Step 2 */}
      <div style={{ marginBottom: 8 }}>
        <button onClick={() => setActiveStep(2)} style={stepHeaderStyle(2)}>
          {t('generate.step2')}
        </button>
        {activeStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
            {skills.map((s) => {
              const checked = selectedSkills.has(s.slug);
              return (
                <label
                  key={s.slug}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 10px',
                    fontSize: 12,
                    color: 'var(--color-text-heading)',
                    cursor: 'pointer',
                  }}
                >
                  {checked ? (
                    <CheckSquare size={16} weight="fill" color="var(--color-primary)" />
                  ) : (
                    <Square size={16} color="var(--color-text-muted)" />
                  )}
                  <span
                    onClick={() => toggleSkill(s.slug)}
                    style={{ fontWeight: 500 }}
                  >
                    {s.title}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Step 3 */}
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setActiveStep(3)} style={stepHeaderStyle(3)}>
          {t('generate.step3')}
        </button>
        {activeStep === 3 && (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('generate.placeholder')}
            style={{
              width: '100%',
              minHeight: 80,
              padding: 10,
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-body)',
              fontFamily: 'inherit',
              fontSize: 12,
              lineHeight: 1.4,
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        )}
      </div>

      {/* Generate */}
      <button
        onClick={handleGenerate}
        disabled={selectedSkills.size === 0 || isGenerating}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 16px',
          borderRadius: 6,
          border: 'none',
          background: selectedSkills.size === 0 ? 'var(--color-border)' : 'var(--color-primary)',
          color: selectedSkills.size === 0 ? 'var(--color-text-muted)' : '#fff',
          fontSize: 12,
          fontWeight: 600,
          cursor: selectedSkills.size === 0 ? 'default' : 'pointer',
          fontFamily: 'inherit',
          opacity: isGenerating ? 0.7 : 1,
        }}
      >
        <Rocket size={14} weight="fill" />
        {isGenerating ? t('generate.generating') : t('generate.button')}
      </button>
    </div>
  );
}
