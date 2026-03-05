import { ScreenRenderer } from '@/screen-renderer/ScreenRenderer';
import { generateConfig } from '@/screens/Generate/Generate.screen';
import { GenerateSlot } from './GenerateSlot';

export default function GeneratePage() {
  return (
    <ScreenRenderer
      config={generateConfig}
      slots={{
        generator: <GenerateSlot />,
      }}
    />
  );
}
