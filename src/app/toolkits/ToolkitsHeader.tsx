'use client';

import { useLocale } from '@/platform/screen-renderer/LocaleContext';
import { PageHeader } from '@/platform/components/PageHeader';

export function ToolkitsHeader() {
  const { t } = useLocale();
  return (
    <div>
      <PageHeader title={t('toolkits.title')} subtitle={t('toolkits.subtitle')} />
    </div>
  );
}
