'use client';

import { createContext, useContext } from 'react';

/** Client-side session shape — matches the server Session interface. */
export interface ClientSession {
  userId: string;
  email: string;
  roleId: string;
  roleSlug: string;
}

const SessionContext = createContext<ClientSession | null>(null);

interface SessionProviderProps {
  session: ClientSession | null;
  children: React.ReactNode;
}

export function SessionProvider({ session, children }: SessionProviderProps) {
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSession(): ClientSession | null {
  return useContext(SessionContext);
}
