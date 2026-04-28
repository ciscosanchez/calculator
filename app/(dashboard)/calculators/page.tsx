import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Pricing Calculators' }

const calculators = [
  {
    href: '/calculators/final-mile',
    title: 'Final Mile Delivery',
    desc: 'Price route-based delivery using stops, mileage, labor, and costs.',
    hours: '7.2h',
    margin: '32.5%',
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 5v3h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    href: '/calculators/final-mile', // TODO: /calculators/hotel-installation
    title: 'Installation Services',
    desc: 'Price installation projects by scope, labor, equipment, and complexity.',
    hours: '5.4h',
    margin: '28.3%',
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
  {
    href: '/calculators/final-mile', // TODO: /calculators/pallet-handling
    title: 'Pallet Handling',
    desc: 'Calculate handling, forklift, and storage margin with ease.',
    hours: '3.1h',
    margin: '30.2%',
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="14" width="20" height="3" rx="1"/>
        <rect x="4" y="10" width="16" height="4" rx="1"/>
        <rect x="4" y="6" width="16" height="4" rx="1"/>
        <rect x="2" y="17" width="3" height="4" rx="1"/>
        <rect x="19" y="17" width="3" height="4" rx="1"/>
      </svg>
    ),
  },
  {
    href: '/calculators/final-mile', // TODO: /calculators/warehouse-storage
    title: 'Warehouse Storage',
    desc: 'Estimate storage fees, space costs, and monthly margin.',
    hours: '—',
    margin: '26.8%',
    icon: (
      <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
]

export default function CalculatorsPage() {
  return (
    <>
      {/* Page header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-sub mb-2">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Calculators
          </div>
          <h1 className="font-condensed font-extrabold text-[1.85rem] text-text-main leading-tight">
            Pricing Calculators
          </h1>
          <p className="text-sm text-text-sub mt-1 max-w-lg">
            Select a service type to build a new quote with intelligent pricing calculators.
          </p>
        </div>

        {/* Decorative illustration */}
        <svg width="180" height="120" viewBox="0 0 180 120" fill="none" aria-hidden>
          <ellipse cx="120" cy="60" rx="55" ry="50" fill="#EFF6FF" opacity="0.7"/>
          <rect x="88" y="18" width="64" height="80" rx="10" fill="white" stroke="#DBEAFE" strokeWidth="1.5"/>
          <rect x="94" y="26" width="52" height="18" rx="5" fill="#EFF6FF"/>
          <rect x="96" y="52" width="12" height="10" rx="3" fill="#BFDBFE"/>
          <rect x="114" y="52" width="12" height="10" rx="3" fill="#BFDBFE"/>
          <rect x="132" y="52" width="12" height="10" rx="3" fill="#93C5FD"/>
          <rect x="96" y="68" width="12" height="10" rx="3" fill="#BFDBFE"/>
          <rect x="114" y="68" width="12" height="10" rx="3" fill="#BFDBFE"/>
          <rect x="132" y="68" width="12" height="22" rx="3" fill="#2563EB"/>
          <rect x="96" y="84" width="30" height="10" rx="3" fill="#BFDBFE"/>
          <circle cx="36" cy="38" r="8" fill="#2563EB" opacity="0.15"/>
          <circle cx="36" cy="38" r="5" fill="#2563EB" opacity="0.3"/>
          <circle cx="36" cy="38" r="2.5" fill="#2563EB"/>
          <circle cx="58" cy="72" r="8" fill="#2563EB" opacity="0.15"/>
          <circle cx="58" cy="72" r="5" fill="#2563EB" opacity="0.3"/>
          <circle cx="58" cy="72" r="2.5" fill="#2563EB"/>
          <path d="M36 38 Q47 55 58 72" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5"/>
        </svg>
      </div>

      {/* Calculator grid */}
      <div className="grid grid-cols-2 gap-5 max-w-4xl">
        {calculators.map((calc) => (
          <Link
            key={calc.title}
            href={calc.href}
            className="card p-6 flex flex-col gap-4 hover:border-brand/40 hover:shadow-sm transition-all group cursor-pointer"
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-brand-light text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
              {calc.icon}
            </div>

            {/* Text */}
            <div>
              <div className="font-semibold text-text-main text-[0.95rem]">{calc.title}</div>
              <div className="text-sm text-text-sub mt-1 leading-snug">{calc.desc}</div>
            </div>

            {/* Footer metrics */}
            <div className="flex items-center gap-3 mt-auto pt-2 border-t border-ui-border">
              <div className="flex items-center gap-1.5 text-xs text-text-sub">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <strong className="text-text-main">{calc.hours}</strong>
                <span>Est. Hours</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-sub">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                </svg>
                <strong className="text-text-main">{calc.margin}</strong>
                <span>Avg. Margin</span>
              </div>
              <div className="ml-auto text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Performance snapshot panel */}
      <div className="mt-7 max-w-4xl">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-semibold text-text-main">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Performance Snapshot
            </div>
            <button className="flex items-center gap-1.5 text-sm font-semibold text-text-sub border border-ui-border rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
              This Month
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {[
              { label: 'Quotes Created', value: '48', change: '+12%', up: true  },
              { label: 'Win Rate',       value: '72%', change: '+4%', up: true  },
              { label: 'Avg Margin',     value: '21.4%', change: '+0.8pts', up: true },
              { label: 'Revenue',        value: '$284K', change: '+12%', up: true },
            ].map((m) => (
              <div key={m.label}>
                <div className="text-xs font-semibold text-text-sub mb-1">{m.label}</div>
                <div className="text-xl font-extrabold font-condensed text-text-main">{m.value}</div>
                <div className={`flex items-center gap-1 text-xs font-semibold mt-0.5 ${m.up ? 'text-success' : 'text-danger'}`}>
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    {m.up ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
                  </svg>
                  {m.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
