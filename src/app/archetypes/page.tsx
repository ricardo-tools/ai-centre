import { ScreenRenderer } from '@/screen-renderer/ScreenRenderer';
import { archetypesConfig } from '@/screens/Archetypes/Archetypes.screen';
import { ArchetypesHeader } from './ArchetypesHeader';
import { ArchetypesCards } from './ArchetypesCards';

export default function ArchetypesPage() {
  return (
    <ScreenRenderer
      config={archetypesConfig}
      slots={{
        header: <ArchetypesHeader />,
        cards: <ArchetypesCards />,
      }}
    />
  );
}
