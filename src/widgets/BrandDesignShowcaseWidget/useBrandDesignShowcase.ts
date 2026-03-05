'use client';

import { useState, useEffect } from 'react';

interface BrandDesignShowcaseData {
  loaded: boolean;
}

const MOCK_DATA: BrandDesignShowcaseData = { loaded: true };

export function useBrandDesignShowcase(mock = false): BrandDesignShowcaseData {
  const [data, setData] = useState<BrandDesignShowcaseData>(mock ? MOCK_DATA : { loaded: false });

  useEffect(() => {
    if (!mock) {
      setData({ loaded: true });
    }
  }, [mock]);

  return data;
}
