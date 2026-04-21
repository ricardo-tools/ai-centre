import { AppShell } from '../../src/domain/types';
import EzyCollectLegacyShell from './EzyCollectLegacyShell';
import NewWorkflowsShell from './NewWorkflowsShell';
import SimplyPaidShell from './SimplyPaidShell';

interface ShellSelectorProps {
  shell: AppShell;
  activeNav?: string;
  children: React.ReactNode;
}

export default function ShellSelector({ shell, activeNav, children }: ShellSelectorProps) {
  switch (shell) {
    case 'new-workflows':
      return <NewWorkflowsShell activeNav={activeNav}>{children}</NewWorkflowsShell>;
    case 'simplypaid':
      return <SimplyPaidShell activeNav={activeNav}>{children}</SimplyPaidShell>;
    case 'ezycollect-legacy':
    default:
      return <EzyCollectLegacyShell activeNav={activeNav}>{children}</EzyCollectLegacyShell>;
  }
}
