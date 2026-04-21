import type { RenderableWidget } from '../domain/types';
import { ProjectCardWidget } from './ProjectCardWidget/ProjectCardWidget';
import { PrototypeCardWidget } from './PrototypeCardWidget/PrototypeCardWidget';
import { CommentPanelWidget } from './CommentPanelWidget/CommentPanelWidget';

export const widgetRegistry: Record<string, RenderableWidget> = {
  [ProjectCardWidget.widgetId]: ProjectCardWidget,
  [PrototypeCardWidget.widgetId]: PrototypeCardWidget,
  [CommentPanelWidget.widgetId]: CommentPanelWidget,
} as const;
