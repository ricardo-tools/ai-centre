import { ScreenRenderer } from '@/platform/screen-renderer/ScreenRenderer';
import { galleryViewerConfig } from '@/platform/screens/GalleryViewer/GalleryViewer.screen';
import { GalleryViewerSlot } from './GalleryViewerSlot';

// Thumbnail generation calls an external screenshot service that can take 15-30s
export const maxDuration = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GalleryViewerPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <ScreenRenderer
      config={galleryViewerConfig}
      slots={{
        viewer: <GalleryViewerSlot id={id} />,
      }}
    />
  );
}
