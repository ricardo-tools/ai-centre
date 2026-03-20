'use client';

import { useLocale } from '@/platform/screen-renderer/LocaleContext';
import { PageHeader } from '@/platform/components/PageHeader';

export function ArchetypesHeader() {
  const { t } = useLocale();
  return (
    <div style={{ maxWidth: 960 }}>
      <PageHeader title={t('archetypes.title')} subtitle={t('archetypes.subtitle')} />
    </div>
  );
}
