import { ScreenRenderer } from '@/platform/screen-renderer/ScreenRenderer';
import { galleryUploadConfig } from '@/platform/screens/GalleryUpload/GalleryUpload.screen';
import { ShowcaseUploadWidget } from '@/features/showcase-gallery/widgets/ShowcaseUploadWidget';
import { getBehaviouralSkills } from '@/platform/lib/skills';

export default function GalleryUploadPage() {
  const skills = getBehaviouralSkills().map((s) => ({ slug: s.slug, title: s.title }));

  return (
    <ScreenRenderer
      config={galleryUploadConfig}
      slots={{
        'upload-form': <ShowcaseUploadWidget skills={skills} />,
      }}
    />
  );
}
