'use client';

import { useState, useEffect } from 'react';

interface FrontendArchitectureShowcaseData {
  loaded: boolean;
}

const MOCK_DATA: FrontendArchitectureShowcaseData = { loaded: true };

export function useFrontendArchitectureShowcase(mock = false): FrontendArchitectureShowcaseData {
  const [data, setData] = useState<FrontendArchitectureShowcaseData>(mock ? MOCK_DATA : { loaded: false });

  useEffect(() => {
    if (!mock) {
      setData({ loaded: true });
    }
  }, [mock]);

  return data;
}
