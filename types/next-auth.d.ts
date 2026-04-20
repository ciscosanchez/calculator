import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      tenantId: string
      tenant: {
        id: string
        name: string
        slug: string
        locations: Array<{
          id: string
          name: string
        }>
      }
    } & DefaultSession['user']
  }

  interface User {
    role: string
    tenantId: string
    tenant: any
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    tenantId: string
    tenant: any
  }
}
