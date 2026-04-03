'use client';

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthSessionProvider
      refetchInterval={15 * 60} // Verifica sessao a cada 15 min
      refetchOnWindowFocus={true} // Verifica ao focar a janela
      refetchWhenOffline={false}
    >
      {children}
    </NextAuthSessionProvider>
  );
}
