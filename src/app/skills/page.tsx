import { ScreenRenderer } from '@/platform/screen-renderer/ScreenRenderer';
import { skillLibraryConfig } from '@/platform/screens/SkillLibrary/SkillLibrary.screen';
import { SkillLibraryHeader } from './SkillLibraryHeader';
import { SkillLibraryCards } from './SkillLibraryCards';

export default function SkillsPage() {
  return (
    <ScreenRenderer
      config={skillLibraryConfig}
      slots={{
        header: <SkillLibraryHeader />,
        cards: <SkillLibraryCards />,
      }}
    />
  );
}
