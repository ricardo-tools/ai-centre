'use client';

import { useState, useEffect } from 'react';

interface AppLayoutShowcaseData {
  loaded: boolean;
}

const MOCK_DATA: AppLayoutShowcaseData = { loaded: true };

export function useAppLayoutShowcase(mock = false): AppLayoutShowcaseData {
  const [data, setData] = useState<AppLayoutShowcaseData>(mock ? MOCK_DATA : { loaded: false });

  useEffect(() => {
    if (!mock) {
      setData({ loaded: true });
    }
  }, [mock]);

  return data;
}
