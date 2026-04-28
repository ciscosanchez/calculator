import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard' }

// ── Types ─────────────────────────────────────────────────────────────────────

type Status = 'Draft' | 'Sent' | 'Accepted' | 'Rejected'
type ServiceType = 'Final Mile' | 'Hotel Install' | 'Pallet' | 'Warehouse'

const statusStyles: Record<Status, string> = {
  Draft:    'bg-warning-bg    text-warning  border-warning-border',
  Sent:     'bg-brand-light   text-brand    border-brand/20',
  Accepted: 'bg-success-bg   text-success  border-success-border',
  Rejected: 'bg-danger-bg    text-danger   border-danger-border',
}

const statusDotColor: Record<Status, string> = {
  Draft:    '#D97706',
  Sent:     '#2563EB',
  Accepted: '#16A34A',
  Rejected: '#DC2626',
}

const serviceChipStyles: Record<ServiceType, string> = {
  'Final Mile':   'bg-brand-light text-brand    border-brand/20',
  'Hotel Install':'bg-accent-bg   text-accent   border-accent-border',
  'Pallet':       'bg-orange-50   text-orange-600 border-orange-200',
  'Warehouse':    'bg-success-bg  text-success  border-success-border',
}

// ── Mock data (will be replaced with real API calls) ──────────────────────────

const recentQuotes = [
  { id: 'ARW-2026-00047', name: 'Hyatt Centric — FF&E Install',     service: 'Hotel Install' as ServiceType, revenue: '$42,580', margin: 23.5, status: 'Draft'    as Status, updated: '2h ago'      },
  { id: 'ARW-2026-00046', name: 'Amazon Final Mile — Charlotte',    service: 'Final Mile'   as ServiceType, revenue: '$2,470',  margin: 18.2, status: 'Sent'     as Status, updated: 'Yesterday'  },
  { id: 'ARW-2026-00045', name: 'Wayfair Pallet Handling — Q2',     service: 'Pallet'       as ServiceType, revenue: '$6,750',  margin: 25.8, status: 'Accepted' as Status, updated: '3 days ago' },
  { id: 'ARW-2026-00044', name: 'IKEA Warehouse Storage — Annual',  service: 'Warehouse'    as ServiceType, revenue: '$31,250', margin: 22.1, status: 'Sent'     as Status, updated: '5 days ago' },
  { id: 'ARW-2026-00043', name: 'Ashley Furniture Final Mile',      service: 'Final Mile'   as ServiceType, revenue: '$1,080',  margin: 12.3, status: 'Rejected' as Status, updated: '1 week ago' },
]

const servicePerformance = [
  { label: 'Final Mile Delivery',      color: '#2563EB', stats: '18 quotes · $48K revenue',   pct: 72 },
  { label: 'Hotel FF&E Installation',  color: '#7C3AED', stats: '9 quotes · $184K revenue',   pct: 88 },
  { label: 'Pallet Handling',          color: '#EA580C', stats: '12 quotes · $32K revenue',   pct: 48 },
  { label: 'Warehouse Storage',        color: '#16A34A', stats: '8 quotes · $62K revenue',    pct: 56 },
]

const activity = [
  { initials: 'JS', gradient: 'linear-gradient(135deg,#2563EB,#7C3AED)', text: <><strong>John Smith</strong> created a quote <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-orange-50 text-orange-600">ARW-00047</span></>, time: '2 hours ago' },
  { initials: 'SC', gradient: 'linear-gradient(135deg,#16A34A,#059669)', text: <><strong>Sarah Connor</strong> sent quote <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-brand-light text-brand">ARW-00046</span></>, time: 'Yesterday, 3:14pm' },
  { initials: 'MJ', gradient: 'linear-gradient(135deg,#7C3AED,#4F46E5)', text: <><strong>Mike Johnson</strong> updated cost profile <strong>Final Mile NE</strong></>, time: '3 days ago' },
  { initials: 'SC', gradient: 'linear-gradient(135deg,#16A34A,#059669)', text: <>Quote <span className="px-1.5 py-0.5 rounded text-xs font-semibold bg-success-bg text-success">ARW-00045</span> <strong>accepted</strong> by Wayfair</>, time: '3 days ago' },
]

const systemHealth = [
  { label: 'Pricing Engine', value: 'Operational', ok: true  },
  { label: 'Cost Profiles',  value: '18 active',   ok: true  },
  { label: 'Fuel Rates',     value: 'Updated 3d ago', ok: false, warn: true },
  { label: 'NetSuite Sync',  value: 'Last sync 4h ago', ok: true },
  { label: 'Users Online',   value: '9 active',    ok: true  },
]

// ── KPI Sparkline ─────────────────────────────────────────────────────────────

function Sparkline({ points, stroke, fill }: { points: string; stroke: string; fill: string }) {
  return (
    <svg className="w-full h-8 mt-2" viewBox="0 0 120 32" fill="none">
      <polyline points={points} stroke={stroke} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points={`${points} 120,32 0,32`} fill={fill} opacity="0.6"/>
    </svg>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <>
      {/* Greeting row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-condensed font-extrabold text-[2rem] text-text-main leading-tight">
            Good morning, John
          </h1>
          <p className="text-sm text-text-sub mt-0.5">
            Here&apos;s what&apos;s happening across Armstrong Corporate today.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/quotes"
            className="h-9 px-4 border border-ui-border rounded-lg bg-white text-sm font-semibold text-text-main hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            View All Quotes
          </Link>
          <Link
            href="/calculators/final-mile"
            className="h-9 px-4 bg-brand hover:bg-brand-pill text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Quote
          </Link>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Quotes This Month */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-sub uppercase tracking-wider">Quotes This Month</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand-light text-brand">
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
          </div>
          <div className="text-[1.75rem] font-extrabold font-condensed text-text-main mt-1">23</div>
          <div className="flex items-center gap-1 text-xs font-semibold text-success mt-0.5">
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
            +4 vs last month
          </div>
          <Sparkline points="0,28 20,22 40,25 60,18 80,14 100,10 120,6" stroke="#2563EB" fill="#EFF6FF"/>
        </div>

        {/* Revenue */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-sub uppercase tracking-wider">Revenue (Accepted)</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-success-bg text-success">
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
          </div>
          <div className="text-[1.75rem] font-extrabold font-condensed text-text-main mt-1">$284K</div>
          <div className="flex items-center gap-1 text-xs font-semibold text-success mt-0.5">
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
            +12% vs last month
          </div>
          <Sparkline points="0,26 20,24 40,20 60,22 80,16 100,12 120,8" stroke="#16A34A" fill="#F0FDF4"/>
        </div>

        {/* Win Rate */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-sub uppercase tracking-wider">Win Rate</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent-bg text-accent">
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                <polyline points="16 7 22 7 22 13"/>
              </svg>
            </div>
          </div>
          <div className="text-[1.75rem] font-extrabold font-condensed text-text-main mt-1">40.4%</div>
          <div className="flex items-center gap-1 text-xs font-semibold text-danger mt-0.5">
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            −2.1% vs last month
          </div>
          <Sparkline points="0,10 20,12 40,9 60,14 80,12 100,18 120,20" stroke="#7C3AED" fill="#F5F3FF"/>
        </div>

        {/* Avg Margin */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-sub uppercase tracking-wider">Avg Gross Margin</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-warning-bg text-warning">
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
          </div>
          <div className="text-[1.75rem] font-extrabold font-condensed text-text-main mt-1">21.4%</div>
          <div className="flex items-center gap-1 text-xs font-semibold text-success mt-0.5">
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>
            +0.8pts vs last month
          </div>
          <Sparkline points="0,22 20,20 40,18 60,16 80,15 100,13 120,11" stroke="#D97706" fill="#FFFBEB"/>
        </div>
      </div>

      {/* Main grid: left + right */}
      <div className="grid grid-cols-[1fr_300px] gap-5">

        {/* LEFT */}
        <div className="flex flex-col gap-5">

          {/* Recent Quotes */}
          <div className="card">
            <div className="flex items-start justify-between px-5 py-4 border-b border-ui-border">
              <div>
                <div className="font-semibold text-text-main">Recent Quotes</div>
                <div className="text-xs text-text-sub mt-0.5">Latest activity across all service types</div>
              </div>
              <Link href="/quotes" className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
                View all
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-ui-border bg-gray-50">
                  {['Quote', 'Service', 'Revenue', 'Margin', 'Status', 'Updated'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[0.72rem] font-bold text-text-sub uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentQuotes.map((q) => (
                  <Link key={q.id} href="/quotes" legacyBehavior>
                    <tr className="table-row-clickable border-b border-ui-border last:border-0">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-text-main">{q.name}</div>
                        <div className="text-xs text-text-sub">{q.id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${serviceChipStyles[q.service]}`}>
                          {q.service}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-text-main">{q.revenue}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${q.margin >= 20 ? 'text-success' : q.margin >= 15 ? 'text-warning' : 'text-danger'}`}>
                          {q.margin}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusStyles[q.status]}`}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusDotColor[q.status] }} />
                          {q.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-text-sub">{q.updated}</td>
                    </tr>
                  </Link>
                ))}
              </tbody>
            </table>
          </div>

          {/* Performance by Service */}
          <div className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-semibold text-text-main">Performance by Service Type</div>
                <div className="text-xs text-text-sub mt-0.5">Margin and volume this quarter</div>
              </div>
              <Link href="/calculators" className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
                Open calculators
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {servicePerformance.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-text-main">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                      {s.label}
                    </div>
                    <span className="text-xs text-text-sub">{s.stats}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${s.pct}%`, background: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-4">

          {/* Quick Actions */}
          <div className="card p-4">
            <div className="text-xs font-bold text-text-sub uppercase tracking-wider mb-3">Quick Actions</div>
            <div className="flex flex-col gap-2">
              {[
                { href: '/calculators/final-mile', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, iconBg: 'bg-brand-light text-brand', title: 'New Final Mile Quote', desc: 'Calculate route cost + pricing' },
                { href: '/calculators',             icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/></svg>,        iconBg: 'bg-accent-bg text-accent',    title: 'All Calculators',        desc: 'Hotel, Pallet, Warehouse, Final Mile' },
                { href: '/scenarios',               icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,                                          iconBg: 'bg-success-bg text-success',  title: 'Run Scenario Builder',   desc: 'What-if margin analysis' },
                { href: '/costs/new',               icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,                 iconBg: 'bg-orange-50 text-orange-600',title: 'New Cost Profile',        desc: 'Add labor, equipment, overhead rates' },
              ].map((qa) => (
                <Link
                  key={qa.href}
                  href={qa.href}
                  className="flex items-center gap-3 p-3 rounded-lg border border-ui-border bg-white hover:bg-gray-50 hover:border-brand/30 transition-all"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${qa.iconBg}`}>
                    {qa.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-text-main">{qa.title}</div>
                    <div className="text-xs text-text-sub truncate">{qa.desc}</div>
                  </div>
                  <svg className="text-text-sub flex-shrink-0" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Quote Performance ring */}
          <div className="card p-4">
            <div className="font-semibold text-text-main mb-3">Quote Performance</div>
            <div className="flex items-center gap-4">
              {/* Ring SVG — 40% filled */}
              <div className="relative flex-shrink-0">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#E5E7EB" strokeWidth="8"/>
                  <circle
                    cx="40" cy="40" r="32" fill="none"
                    stroke="#16A34A" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 32 * 0.4} ${2 * Math.PI * 32 * 0.6}`}
                    strokeDashoffset={2 * Math.PI * 32 * 0.25}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-extrabold font-condensed text-text-main">40%</span>
                  <span className="text-[0.6rem] font-semibold text-text-sub uppercase tracking-wider">Win Rate</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                {[
                  { label: 'Accepted', value: '19', color: 'text-success' },
                  { label: 'Pending',  value: '14', color: 'text-warning' },
                  { label: 'Rejected', value: '9',  color: 'text-danger'  },
                  { label: 'Draft',    value: '5',  color: 'text-text-main' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-4">
                    <span className="text-text-sub">{s.label}</span>
                    <span className={`font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="card p-4">
            <div className="font-semibold text-text-main mb-3">System Health</div>
            <div className="flex flex-col gap-2.5">
              {systemHealth.map((h) => (
                <div key={h.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-text-main">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${h.ok ? 'bg-success' : h.warn ? 'bg-warning' : 'bg-danger'}`} />
                    {h.label}
                  </div>
                  <span className={`font-semibold ${h.ok ? 'text-success' : h.warn ? 'text-warning' : 'text-danger'}`}>
                    {h.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-text-main">Recent Activity</div>
              <Link href="/quotes" className="text-xs font-semibold text-brand hover:underline">View all</Link>
            </div>
            <div className="flex flex-col gap-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: a.gradient }}
                  >
                    {a.initials}
                  </div>
                  <div>
                    <div className="text-sm text-text-main leading-snug">{a.text}</div>
                    <div className="text-xs text-text-sub mt-0.5">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
