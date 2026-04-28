import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// ── Role type ─────────────────────────────────────────────────────────────────

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER'

declare module 'next-auth' {
  interface Session {
    user: {
      id:       string
      email:    string
      name?:    string | null
      initials: string
      role:     UserRole
    }
  }
  interface User {
    id:       string
    initials: string
    role:     UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id:       string
    initials: string
    role:     UserRole
  }
}

// ── Demo users (replace with Prisma lookup when DB is wired) ─────────────────

const DEMO_USERS = [
  {
    id:       '1',
    email:    'admin@armstrong.com',
    password: 'armstrong2026',
    name:     'Super Admin',
    initials: 'SA',
    role:     'SUPER_ADMIN' as UserRole,
  },
  {
    id:       '2',
    email:    'j.smith@armstrong.com',
    password: 'armstrong2026',
    name:     'John Smith',
    initials: 'JS',
    role:     'ADMIN' as UserRole,
  },
  {
    id:       '3',
    email:    'm.johnson@armstrong.com',
    password: 'armstrong2026',
    name:     'Mike Johnson',
    initials: 'MJ',
    role:     'USER' as UserRole,
  },
]

// ── Auth options ──────────────────────────────────────────────────────────────

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge:   24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = DEMO_USERS.find(
          (u) => u.email === credentials.email && u.password === credentials.password,
        )
        if (!user) return null

        return {
          id:       user.id,
          email:    user.email,
          name:     user.name,
          initials: user.initials,
          role:     user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id       = user.id
        token.initials = user.initials
        token.role     = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.id       = token.id
      session.user.initials = token.initials
      session.user.role     = token.role
      return session
    },
  },
}
