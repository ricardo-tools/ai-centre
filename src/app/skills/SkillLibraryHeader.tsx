'use client';

import { useLocale } from '@/screen-renderer/LocaleContext';
import { PageHeader } from '@/components/PageHeader';

export function SkillLibraryHeader() {
  const { t } = useLocale();
  return <PageHeader title={t('skills.title')} subtitle={t('skills.subtitle')} />;
}
