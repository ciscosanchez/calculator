'use client'

import { SessionProvider } from 'next-auth/react'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/v2/api/auth">
      {children}
    </SessionProvider>
  )
}
