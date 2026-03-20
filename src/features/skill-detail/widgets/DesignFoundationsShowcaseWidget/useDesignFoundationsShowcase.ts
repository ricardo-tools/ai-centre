'use client';

import { useState, useEffect } from 'react';

interface DesignFoundationsShowcaseData {
  loaded: boolean;
}

const MOCK_DATA: DesignFoundationsShowcaseData = { loaded: true };

export function useDesignFoundationsShowcase(mock = false): DesignFoundationsShowcaseData {
  const [data, setData] = useState<DesignFoundationsShowcaseData>(mock ? MOCK_DATA : { loaded: false });

  useEffect(() => {
    if (!mock) {
      setData({ loaded: true });
    }
  }, [mock]);

  return data;
}
