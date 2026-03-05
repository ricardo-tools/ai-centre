import { ScreenRenderer } from '@/screen-renderer/ScreenRenderer';
import { homeConfig } from '@/screens/Home/Home.screen';
import { HomeHero } from './HomeHero';
import { HomeSkillList } from './HomeSkillList';

export default function HomePage() {
  return (
    <ScreenRenderer
      config={homeConfig}
      slots={{
        hero: <HomeHero />,
        skills: <HomeSkillList />,
      }}
    />
  );
}
