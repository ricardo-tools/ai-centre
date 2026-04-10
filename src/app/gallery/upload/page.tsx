import { ScreenRenderer } from '@/platform/screen-renderer/ScreenRenderer';
import { galleryUploadConfig } from '@/platform/screens/GalleryUpload/GalleryUpload.screen';
import { ShowcaseUploadWidget } from '@/features/showcase-gallery/widgets/ShowcaseUploadWidget';
import { getAllSkills } from '@/platform/lib/skills';

export default function GalleryUploadPage() {
  const skills = getAllSkills().map((s) => ({ slug: s.slug, title: s.title }));

  return (
    <ScreenRenderer
      config={galleryUploadConfig}
      slots={{
        'upload-form': <ShowcaseUploadWidget skills={skills} />,
      }}
    />
  );
}
