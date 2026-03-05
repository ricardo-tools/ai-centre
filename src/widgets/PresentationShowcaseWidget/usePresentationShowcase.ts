'use client';

import { useState, useEffect } from 'react';

interface PresentationShowcaseData {
  loaded: boolean;
}

const MOCK_DATA: PresentationShowcaseData = { loaded: true };

export function usePresentationShowcase(mock = false): PresentationShowcaseData {
  const [data, setData] = useState<PresentationShowcaseData>(mock ? MOCK_DATA : { loaded: false });

  useEffect(() => {
    if (!mock) {
      setData({ loaded: true });
    }
  }, [mock]);

  return data;
}
