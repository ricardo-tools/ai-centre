import type { RenderableWidget } from '../../domain/types';
import PrototypeCardXS from './PrototypeCardXS';
import PrototypeCardSM from './PrototypeCardSM';
import PrototypeCardMD from './PrototypeCardMD';
import PrototypeCardLG from './PrototypeCardLG';

export const PrototypeCardWidget: RenderableWidget = {
  widgetId: 'prototype-card',
  component: {
    xs: PrototypeCardXS as React.ComponentType<unknown>,
    sm: PrototypeCardSM as React.ComponentType<unknown>,
    md: PrototypeCardMD as React.ComponentType<unknown>,
    lg: PrototypeCardLG as React.ComponentType<unknown>,
  },
};
