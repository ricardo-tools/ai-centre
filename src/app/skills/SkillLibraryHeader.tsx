'use client';

import { useLocale } from '@/platform/screen-renderer/LocaleContext';
import { PageHeader } from '@/platform/components/PageHeader';

export function SkillLibraryHeader() {
  const { t } = useLocale();
  return <PageHeader title={t('skills.title')} subtitle={t('skills.subtitle')} />;
}
