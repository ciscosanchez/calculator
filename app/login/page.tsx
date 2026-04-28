'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (!result?.ok) {
      setError('Invalid email or password.')
      return
    }

    const callbackUrl = searchParams.get('callbackUrl') || '/'
    router.push(callbackUrl)
  }

  return (
    <>
      {error && (
        <div className="mb-4 px-3 py-2.5 rounded-lg bg-danger-bg border border-danger-border text-danger text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-text-sub block mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@armstrong.com"
            className="w-full h-10 border border-ui-border rounded-lg px-3 text-sm text-text-main placeholder:text-text-sub outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-colors bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-sub block mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full h-10 border border-ui-border rounded-lg px-3 text-sm text-text-main placeholder:text-text-sub outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-colors bg-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="h-10 bg-brand hover:bg-brand-pill disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors mt-1"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center p-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="8" fill="#1D4ED8"/>
            <path d="M18 7L29 27H7L18 7Z" fill="white" opacity="0.9"/>
            <path d="M18 14L23 24H13L18 14Z" fill="#1D4ED8"/>
          </svg>
          <div>
            <div className="font-condensed font-extrabold text-lg text-navy tracking-[0.08em]">ARMSTRONG</div>
            <div className="text-[0.65rem] font-semibold text-text-sub tracking-[0.14em] uppercase -mt-0.5">PRICING</div>
          </div>
        </div>

        <div className="card p-8">
          <h1 className="font-condensed font-extrabold text-2xl text-text-main text-center mb-1">Sign in</h1>
          <p className="text-sm text-text-sub text-center mb-6">Access your Armstrong Pricing account</p>
          <Suspense>
            <LoginForm />
          </Suspense>
          <p className="text-xs text-text-sub text-center mt-5">
            Need access?{' '}
            <a href="mailto:admin@armstrong.com" className="text-brand font-semibold hover:underline">
              Contact your Admin
            </a>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 card p-4 text-xs text-text-sub space-y-1">
          <div className="font-semibold text-text-main mb-2">Demo accounts</div>
          <div className="flex justify-between"><span>admin@armstrong.com</span><span className="font-semibold text-warning">God Mode</span></div>
          <div className="flex justify-between"><span>j.smith@armstrong.com</span><span className="font-semibold text-brand">Admin</span></div>
          <div className="flex justify-between"><span>m.johnson@armstrong.com</span><span className="font-semibold text-text-sub">Viewer</span></div>
          <div className="pt-1 text-[0.7rem]">Password for all: <span className="font-mono font-semibold">armstrong2026</span></div>
        </div>

      </div>
    </div>
  )
}
