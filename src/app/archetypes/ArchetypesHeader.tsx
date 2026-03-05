'use client';

import { useLocale } from '@/screen-renderer/LocaleContext';
import { PageHeader } from '@/components/PageHeader';

export function ArchetypesHeader() {
  const { t } = useLocale();
  return (
    <div style={{ maxWidth: 960 }}>
      <PageHeader title={t('archetypes.title')} subtitle={t('archetypes.subtitle')} />
    </div>
  );
}
