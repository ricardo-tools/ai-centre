import { ScreenRenderer } from '@/screen-renderer/ScreenRenderer';
import { skillLibraryConfig } from '@/screens/SkillLibrary/SkillLibrary.screen';
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
