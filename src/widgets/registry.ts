'use client';

import { SkillCardWidget } from './SkillCardWidget/SkillCardWidget';
import { SkillListWidget } from './SkillListWidget/SkillListWidget';
import { SkillDetailWidget } from './SkillDetailWidget/SkillDetailWidget';
import { ArchetypeCardWidget } from './ArchetypeCardWidget/ArchetypeCardWidget';
import { ProjectGeneratorWidget } from './ProjectGeneratorWidget/ProjectGeneratorWidget';
import { TopNavWidget } from './TopNavWidget/TopNavWidget';
import { ThemeSwitcherWidget } from './ThemeSwitcherWidget/ThemeSwitcherWidget';
import BrandDesignShowcaseWidget from './BrandDesignShowcaseWidget/BrandDesignShowcaseWidget';
import AppLayoutShowcaseWidget from './AppLayoutShowcaseWidget/AppLayoutShowcaseWidget';
import FrontendArchitectureShowcaseWidget from './FrontendArchitectureShowcaseWidget/FrontendArchitectureShowcaseWidget';
import DesignExcellenceShowcaseWidget from './DesignExcellenceShowcaseWidget/DesignExcellenceShowcaseWidget';
import PresentationShowcaseWidget from './PresentationShowcaseWidget/PresentationShowcaseWidget';
import PrintDesignShowcaseWidget from './PrintDesignShowcaseWidget/PrintDesignShowcaseWidget';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const widgetRegistry: Record<string, React.ComponentType<any>> = {
  'skill-card': SkillCardWidget,
  'skill-list': SkillListWidget,
  'skill-detail': SkillDetailWidget,
  'archetype-card': ArchetypeCardWidget,
  'project-generator': ProjectGeneratorWidget,
  'top-nav': TopNavWidget,
  'theme-switcher': ThemeSwitcherWidget,
  'brand-design-showcase': BrandDesignShowcaseWidget,
  'app-layout-showcase': AppLayoutShowcaseWidget,
  'frontend-architecture-showcase': FrontendArchitectureShowcaseWidget,
  'design-excellence-showcase': DesignExcellenceShowcaseWidget,
  'presentation-showcase': PresentationShowcaseWidget,
  'print-design-showcase': PrintDesignShowcaseWidget,
};
