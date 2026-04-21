import type { RenderableWidget } from '../../domain/types';
import CommentPanelXS from './CommentPanelXS';
import CommentPanelSM from './CommentPanelSM';
import CommentPanelMD from './CommentPanelMD';
import CommentPanelLG from './CommentPanelLG';

export const CommentPanelWidget: RenderableWidget = {
  widgetId: 'comment-panel',
  component: {
    xs: CommentPanelXS as React.ComponentType<unknown>,
    sm: CommentPanelSM as React.ComponentType<unknown>,
    md: CommentPanelMD as React.ComponentType<unknown>,
    lg: CommentPanelLG as React.ComponentType<unknown>,
  },
};
