import { GalleryHeader } from './GalleryHeader';
import { GalleryCards } from './GalleryCards';

export default function GalleryPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <GalleryHeader />
      <GalleryCards />
    </div>
  );
}
