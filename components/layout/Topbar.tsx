'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

// ── Searchable index (wire to real API when DB is live) ───────────────────────

type ResultKind = 'quote' | 'customer' | 'service' | 'page'

interface SearchResult {
  kind:    ResultKind
  title:   string
  sub:     string
  href:    string
}

const SEARCH_INDEX: SearchResult[] = [
  // Quotes
  { kind: 'quote',    title: 'ARW-2026-00047',                    sub: 'Hyatt Centric — FF&E Install · Draft',          href: '/quotes' },
  { kind: 'quote',    title: 'ARW-2026-00046',                    sub: 'Amazon Final Mile — Charlotte · Sent',          href: '/quotes' },
  { kind: 'quote',    title: 'ARW-2026-00045',                    sub: 'Wayfair Pallet Handling — Q2 · Accepted',       href: '/quotes' },
  { kind: 'quote',    title: 'ARW-2026-00044',                    sub: 'IKEA Warehouse Storage — Annual · Sent',        href: '/quotes' },
  { kind: 'quote',    title: 'ARW-2026-00043',                    sub: 'Ashley Furniture Final Mile · Rejected',        href: '/quotes' },
  // Customers
  { kind: 'customer', title: 'Hyatt Centric',                     sub: 'Hotel Install · 3 quotes',                      href: '/quotes' },
  { kind: 'customer', title: 'Amazon Logistics',                  sub: 'Final Mile · 8 quotes',                         href: '/quotes' },
  { kind: 'customer', title: 'Wayfair',                           sub: 'Pallet Handling · 5 quotes',                    href: '/quotes' },
  { kind: 'customer', title: 'IKEA',                              sub: 'Warehouse Storage · 2 quotes',                  href: '/quotes' },
  { kind: 'customer', title: 'Ashley Furniture',                  sub: 'Final Mile · 4 quotes',                         href: '/quotes' },
  // Services
  { kind: 'service',  title: 'Final Mile Delivery',               sub: 'Calculator · 18 active quotes',                 href: '/calculators/final-mile' },
  { kind: 'service',  title: 'Hotel FF&E Installation',           sub: 'Calculator · 9 active quotes',                  href: '/calculators' },
  { kind: 'service',  title: 'Pallet Handling',                   sub: 'Calculator · 12 active quotes',                 href: '/calculators' },
  { kind: 'service',  title: 'Warehouse Storage',                 sub: 'Calculator · 8 active quotes',                  href: '/calculators' },
  // Pages
  { kind: 'page',     title: 'Dashboard',                         sub: 'Overview and KPIs',                             href: '/dashboard' },
  { kind: 'page',     title: 'Cost Profiles',                     sub: 'Manage labor, fuel, and overhead rates',        href: '/costs' },
  { kind: 'page',     title: 'Scenario Builder',                  sub: 'What-if margin analysis',                       href: '/scenarios' },
  { kind: 'page',     title: 'All Quotes',                        sub: 'Browse and manage quotes',                      href: '/quotes' },
]

const KIND_LABEL: Record<ResultKind, string> = {
  quote:    'Quote',
  customer: 'Customer',
  service:  'Service',
  page:     'Page',
}

const KIND_COLORS: Record<ResultKind, string> = {
  quote:    'bg-warning-bg    text-warning      border-warning-border',
  customer: 'bg-accent-bg     text-accent       border-accent-border',
  service:  'bg-brand-light   text-brand        border-brand/20',
  page:     'bg-gray-100      text-text-sub     border-ui-border',
}

// ── Notifications ─────────────────────────────────────────────────────────────

const NOTIFICATIONS = [
  { id: 1, text: 'Quote ARW-2026-00046 was accepted by Amazon', time: '2 hours ago',   unread: true,  color: 'bg-success' },
  { id: 2, text: 'Fuel rates updated — review your cost profiles', time: '1 day ago',  unread: true,  color: 'bg-warning' },
  { id: 3, text: 'John Smith created quote ARW-2026-00047',        time: '2 days ago', unread: false, color: 'bg-brand'   },
]

// ── Search dropdown ───────────────────────────────────────────────────────────

function SearchBox() {
  const router             = useRouter()
  const [query, setQuery]  = useState('')
  const [open, setOpen]    = useState(false)
  const [cursor, setCursor]= useState(0)
  const inputRef           = useRef<HTMLInputElement>(null)
  const containerRef       = useRef<HTMLDivElement>(null)

  const results = query.trim().length >= 1
    ? SEARCH_INDEX.filter((r) =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.sub.toLowerCase().includes(query.toLowerCase()),
      ).slice(0, 7)
    : []

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); return }
    if (!results.length)   return
    if (e.key === 'ArrowDown')  { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)) }
    if (e.key === 'Enter')      { e.preventDefault(); router.push(results[cursor].href); setOpen(false); setQuery('') }
  }

  return (
    <div ref={containerRef} className="flex-1 max-w-[440px] relative">
      <svg
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none z-10"
        width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        ref={inputRef}
        type="text"
        value={query}
        placeholder="Search quotes, customers, or services…"
        className="w-full h-9 bg-gray-50 border border-ui-border rounded-lg pl-9 pr-3 text-sm text-text-main placeholder:text-text-sub outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/10 transition-colors"
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setCursor(0) }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-ui-border rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map((r, i) => (
            <Link
              key={`${r.kind}-${r.title}`}
              href={r.href}
              onClick={() => { setOpen(false); setQuery('') }}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors',
                cursor === i && 'bg-gray-50',
              )}
            >
              <span className={`text-[0.65rem] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap ${KIND_COLORS[r.kind]}`}>
                {KIND_LABEL[r.kind]}
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-text-main truncate">{r.title}</span>
                <span className="text-xs text-text-sub truncate">{r.sub}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {open && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-ui-border rounded-xl shadow-lg z-50 px-4 py-4 text-sm text-text-sub text-center">
          No results for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  )
}

// ── Topbar ────────────────────────────────────────────────────────────────────

interface TopbarProps {
  variant?:      'default' | 'god-mode'
  workspace?:    string
  showNotifDot?: boolean
}

export default function Topbar({
  variant     = 'default',
  workspace   = 'Armstrong Corporate',
  showNotifDot = true,
}: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const borderClass =
    variant === 'god-mode'
      ? 'border-b-2 border-warning-border'
      : 'border-b border-ui-border'

  return (
    <header
      className={cn(
        'bg-white px-7 h-[60px] flex items-center gap-3.5 sticky top-0 z-40',
        borderClass,
      )}
    >
      {/* Workspace selector */}
      <button className="flex items-center gap-1.5 px-2.5 py-1.5 border border-ui-border rounded-lg bg-white text-sm font-semibold text-text-main hover:bg-gray-50 transition-colors cursor-pointer">
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        </svg>
        {workspace}
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Environment badge */}
      <span className="bg-success-bg text-success text-[0.68rem] font-bold px-2.5 py-0.5 rounded-full border border-success-border tracking-[0.06em] whitespace-nowrap">
        PRODUCTION
      </span>

      <SearchBox />

      {/* Right actions */}
      <div className="flex items-center gap-2.5 ml-auto">
        {/* Notification bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(o => !o)}
            className="w-9 h-9 border border-ui-border rounded-lg bg-white flex items-center justify-center text-text-sub hover:bg-gray-50 transition-colors relative"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {showNotifDot && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-danger border-2 border-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-80 bg-white border border-ui-border rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-ui-border">
                <span className="text-sm font-semibold text-text-main">Notifications</span>
                <button className="text-xs font-semibold text-brand hover:underline">Mark all read</button>
              </div>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-ui-border last:border-0 ${n.unread ? 'bg-gray-50/80' : 'bg-white'}`}>
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-main leading-snug">{n.text}</p>
                    <p className="text-xs text-text-sub mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2.5 text-center">
                <button className="text-xs font-semibold text-brand hover:underline">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        <Link
          href="/calculators/final-mile"
          className="bg-brand hover:bg-brand-pill text-white border-none px-4 h-9 rounded-lg font-sans text-sm font-semibold cursor-pointer flex items-center gap-1.5 whitespace-nowrap transition-colors"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Quote
        </Link>
      </div>
    </header>
  )
}
