import { ScreenRenderer } from '@/platform/screen-renderer/ScreenRenderer';
import { toolkitsConfig } from '@/platform/screens/Toolkits/Toolkits.screen';
import { ToolkitsHeader } from './ToolkitsHeader';
import { ToolkitsCards } from './ToolkitsCards';
import { AlphaBanner } from '@/platform/components/AlphaBanner';

export default function ToolkitsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <AlphaBanner />
      <ScreenRenderer
        config={toolkitsConfig}
        slots={{
          header: <ToolkitsHeader />,
          cards: <ToolkitsCards />,
        }}
      />
    </div>
  );
}
