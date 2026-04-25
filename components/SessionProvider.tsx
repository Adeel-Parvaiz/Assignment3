'use client';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

// Wrapper for NextAuth SessionProvider
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  );
}