'use client';

import { useState, useEffect } from 'react';

interface PrintDesignShowcaseData {
  loaded: boolean;
}

const MOCK_DATA: PrintDesignShowcaseData = { loaded: true };

export function usePrintDesignShowcase(mock = false): PrintDesignShowcaseData {
  const [data, setData] = useState<PrintDesignShowcaseData>(mock ? MOCK_DATA : { loaded: false });

  useEffect(() => {
    if (!mock) {
      setData({ loaded: true });
    }
  }, [mock]);

  return data;
}
