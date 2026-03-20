'use client';

import { useState, useEffect } from 'react';
import { fetchShowcaseById, type RawShowcaseUpload } from '@/features/showcase-gallery/action';
import { ShowcaseViewerWidget } from '@/features/showcase-gallery/widgets/ShowcaseViewerWidget';

interface GalleryViewerSlotProps {
  id: string;
}

export function GalleryViewerSlot({ id }: GalleryViewerSlotProps) {
  const [showcase, setShowcase] = useState<RawShowcaseUpload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchShowcaseById(id).then((result) => {
      if (result.ok) {
        setShowcase(result.value);
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

  return <ShowcaseViewerWidget showcase={showcase} />;
}
