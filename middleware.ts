import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { UserRole } from '@/app/api/auth/[...nextauth]/auth-options'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const role = req.nextauth.token?.role as UserRole | undefined

    // ── Root: send each role to their home ───────────────────────────────────
    if (pathname === '/') {
      const dest = req.nextUrl.clone()
      if (role === 'SUPER_ADMIN') dest.pathname = '/god-mode'
      else if (role === 'USER')   dest.pathname = '/viewer'
      else                        dest.pathname = '/dashboard'
      return NextResponse.redirect(dest)
    }

    // ── God-mode routes: SUPER_ADMIN only ────────────────────────────────────
    if (pathname.startsWith('/god-mode') && role !== 'SUPER_ADMIN') {
      const dest = req.nextUrl.clone()
      dest.pathname = role === 'USER' ? '/viewer' : '/dashboard'
      return NextResponse.redirect(dest)
    }

    // ── Viewer: block USER from any non-viewer route ─────────────────────────
    if (role === 'USER' && !pathname.startsWith('/viewer')) {
      const dest = req.nextUrl.clone()
      dest.pathname = '/viewer'
      return NextResponse.redirect(dest)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // Allow the request if a valid JWT exists; otherwise next-auth redirects to /login
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = {
  matcher: [
    // Protect everything except login, auth API, and static assets
    '/((?!login|api/auth|_next/static|_next/image|favicon\\.ico).*)',
  ],
}
