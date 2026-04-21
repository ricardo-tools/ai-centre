'use client';

import { useState, useEffect } from 'react';

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------

export interface Identity {
  name: string;
  initials: string;
}

export interface UseIdentityReturn {
  identity: Identity | null;
  setIdentity: (name: string) => void;
  clearIdentity: () => void;
  isIdentified: boolean;
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

const STORAGE_KEY = 'prototype-viewer-identity';

function computeInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function buildIdentity(name: string): Identity {
  return { name: name.trim(), initials: computeInitials(name) };
}

function readFromStorage(): Identity | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { name?: string };
    if (typeof parsed.name === 'string' && parsed.name.trim().length > 0) {
      return buildIdentity(parsed.name);
    }
    return null;
  } catch {
    return null;
  }
}

// ------------------------------------------------------------
// Hook
// ------------------------------------------------------------

export function useIdentity(): UseIdentityReturn {
  // Start null — SSR safe. Populated in useEffect once we're on the client.
  const [identity, setIdentityState] = useState<Identity | null>(null);

  useEffect(() => {
    setIdentityState(readFromStorage());
  }, []);

  function setIdentity(name: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: trimmed }));
    setIdentityState(buildIdentity(trimmed));
  }

  function clearIdentity(): void {
    localStorage.removeItem(STORAGE_KEY);
    setIdentityState(null);
  }

  return {
    identity,
    setIdentity,
    clearIdentity,
    isIdentified: identity !== null,
  };
}
