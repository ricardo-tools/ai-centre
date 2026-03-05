'use client';

import { useState, useEffect } from 'react';

interface DesignExcellenceShowcaseData {
  loaded: boolean;
}

const MOCK_DATA: DesignExcellenceShowcaseData = { loaded: true };

export function useDesignExcellenceShowcase(mock = false): DesignExcellenceShowcaseData {
  const [data, setData] = useState<DesignExcellenceShowcaseData>(mock ? MOCK_DATA : { loaded: false });

  useEffect(() => {
    if (!mock) {
      setData({ loaded: true });
    }
  }, [mock]);

  return data;
}
