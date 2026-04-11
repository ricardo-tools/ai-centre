'use client';

import { useState, useEffect } from 'react';
import { fetchShowcaseById, getSignedShowcaseUrl, triggerMigrationDeploy, type RawShowcaseUpload } from '@/features/showcase-gallery/action';
import { ShowcaseViewerWidget } from '@/features/showcase-gallery/widgets/ShowcaseViewerWidget';

interface GalleryViewerSlotProps {
  id: string;
}

export function GalleryViewerSlot({ id }: GalleryViewerSlotProps) {
  const [showcase, setShowcase] = useState<RawShowcaseUpload | null>(null);
  const [signedDeployUrl, setSignedDeployUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchShowcaseById(id),
      getSignedShowcaseUrl(id),
    ]).then(async ([result, signedUrl]) => {
      if (result.ok) {
        const sc = result.value;

        // Lazy migration: trigger deploy for pre-migration ZIP showcases
        if (sc.fileType === 'zip' && sc.deployStatus === 'none') {
          triggerMigrationDeploy(id).catch(() => {});
          // Override status so polling hook picks it up immediately
          sc.deployStatus = 'pending';
        }

        setShowcase(sc);
        setSignedDeployUrl(signedUrl);
      } else {
        setError(true);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 24, color: 'var(--color-text-muted)', fontSize: 14 }}>
        Loading...
      </div>
    );
  }

  if (error || !showcase) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 14 }}>
        Showcase not found.
      </div>
    );
  }

  return <ShowcaseViewerWidget showcase={showcase} signedDeployUrl={signedDeployUrl} />;
}
