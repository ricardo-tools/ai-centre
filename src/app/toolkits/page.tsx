import { ScreenRenderer } from '@/platform/screen-renderer/ScreenRenderer';
import { toolkitsConfig } from '@/platform/screens/Toolkits/Toolkits.screen';
import { ToolkitsHeader } from './ToolkitsHeader';
import { ToolkitsCards } from './ToolkitsCards';

export default function ToolkitsPage() {
  return (
    <ScreenRenderer
      config={toolkitsConfig}
      slots={{
        header: <ToolkitsHeader />,
        cards: <ToolkitsCards />,
      }}
    />
  );
}
