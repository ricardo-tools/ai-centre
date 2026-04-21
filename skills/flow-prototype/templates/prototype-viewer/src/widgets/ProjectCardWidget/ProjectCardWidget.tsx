import type { RenderableWidget } from '../../domain/types';
import ProjectCardXS from './ProjectCardXS';
import ProjectCardSM from './ProjectCardSM';
import ProjectCardMD from './ProjectCardMD';
import ProjectCardLG from './ProjectCardLG';

export const ProjectCardWidget: RenderableWidget = {
  widgetId: 'project-card',
  component: {
    xs: ProjectCardXS as React.ComponentType<unknown>,
    sm: ProjectCardSM as React.ComponentType<unknown>,
    md: ProjectCardMD as React.ComponentType<unknown>,
    lg: ProjectCardLG as React.ComponentType<unknown>,
  },
};
