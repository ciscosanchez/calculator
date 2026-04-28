'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'

type Tab = 'All' | 'My Quotes' | 'Team'
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
  'Final Mile':   'bg-brand-light text-brand      border-brand/20',
  'Hotel Install':'bg-accent-bg   text-accent     border-accent-border',
  'Pallet':       'bg-orange-50   text-orange-600 border-orange-200',
  'Warehouse':    'bg-success-bg  text-success    border-success-border',
}

const quotes = [
  { id: 'ARW-2026-00047', name: 'Hyatt Centric — FF&E Install',         customer: 'Hyatt Hotels Corp.',  service: 'Hotel Install' as ServiceType, revenue: '$42,580', margin: 23.5, status: 'Draft'    as Status, owner: 'JS', updated: 'Apr 23, 2026' },
  { id: 'ARW-2026-00046', name: 'Amazon Final Mile — Charlotte',         customer: 'Amazon Logistics',    service: 'Final Mile'   as ServiceType, revenue: '$2,470',  margin: 18.2, status: 'Sent'     as Status, owner: 'SC', updated: 'Apr 22, 2026' },
  { id: 'ARW-2026-00045', name: 'Wayfair Pallet Handling — Q2',          customer: 'Wayfair Inc.',         service: 'Pallet'       as ServiceType, revenue: '$6,750',  margin: 25.8, status: 'Accepted' as Status, owner: 'JS', updated: 'Apr 20, 2026' },
  { id: 'ARW-2026-00044', name: 'IKEA Warehouse Storage — Annual',       customer: 'IKEA NA',             service: 'Warehouse'    as ServiceType, revenue: '$31,250', margin: 22.1, status: 'Sent'     as Status, owner: 'MJ', updated: 'Apr 18, 2026' },
  { id: 'ARW-2026-00043', name: 'Ashley Furniture Final Mile',           customer: 'Ashley Furniture',    service: 'Final Mile'   as ServiceType, revenue: '$1,080',  margin: 12.3, status: 'Rejected' as Status, owner: 'SC', updated: 'Apr 16, 2026' },
  { id: 'ARW-2026-00042', name: 'Home Depot FF&E Installation — SE',     customer: 'Home Depot Inc.',     service: 'Hotel Install' as ServiceType, revenue: '$78,400', margin: 24.9, status: 'Accepted' as Status, owner: 'JS', updated: 'Apr 14, 2026' },
  { id: 'ARW-2026-00041', name: 'Target Pallet Handling — Midwest Hub',  customer: 'Target Corp.',        service: 'Pallet'       as ServiceType, revenue: '$9,100',  margin: 28.4, status: 'Draft'    as Status, owner: 'MJ', updated: 'Apr 12, 2026' },
  { id: 'ARW-2026-00040', name: 'Chewy Warehouse Storage — Annual',      customer: 'Chewy Inc.',          service: 'Warehouse'    as ServiceType, revenue: '$24,600', margin: 21.5, status: 'Sent'     as Status, owner: 'JS', updated: 'Apr 10, 2026' },
]

const avatarGradients: Record<string, string> = {
  JS: 'linear-gradient(135deg, #2563EB, #7C3AED)',
  SC: 'linear-gradient(135deg, #16A34A, #059669)',
  MJ: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
}

export default function QuotesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const isSuperAdmin = session?.user.role === 'SUPER_ADMIN'
  const [activeTab, setActiveTab]   = useState<Tab>('All')
  const [activePage, setActivePage] = useState(1)

  const totalPages = 5

  return (
    <>
      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="font-condensed font-extrabold text-[1.85rem] text-text-main leading-tight">
            Quotes
          </h1>
          <p className="text-sm text-text-sub mt-1">
            Manage, track, and send pricing quotes across all service types.
          </p>
        </div>
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

      <div className="card">
        {/* Tabs + filter row */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-ui-border">
          <div className="flex gap-1">
            {(['All', 'My Quotes', 'Team'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors',
                  activeTab === tab
                    ? 'bg-brand-light text-brand'
                    : 'text-text-sub hover:bg-gray-100 hover:text-text-main',
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search quotes…"
                className="h-8 pl-8 pr-3 border border-ui-border rounded-lg bg-gray-50 text-sm text-text-main placeholder:text-text-sub outline-none focus:border-brand focus:bg-white transition-colors w-48"
              />
            </div>
            {/* Filter */}
            <button className="h-8 px-3 border border-ui-border rounded-lg bg-white text-sm font-medium text-text-sub hover:bg-gray-50 transition-colors flex items-center gap-1.5">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filter
            </button>
            {/* Export */}
            <button className="h-8 px-3 border border-ui-border rounded-lg bg-white text-sm font-medium text-text-sub hover:bg-gray-50 transition-colors flex items-center gap-1.5">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-ui-border">
                {['Quote / Project', 'Service', 'Customer', 'Revenue', 'Margin', 'Status', 'Owner', 'Updated', ''].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[0.72rem] font-bold text-text-sub uppercase tracking-wider whitespace-nowrap first:pl-5 last:pr-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr
                  key={q.id}
                  onClick={() => router.push('/calculators/final-mile')}
                  className="table-row-clickable border-b border-ui-border last:border-0"
                >
                  <td className="px-4 py-3 pl-5">
                    <div className="text-sm font-medium text-text-main">{q.name}</div>
                    <div className="text-xs text-text-sub mt-0.5">{q.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border', serviceChipStyles[q.service])}>
                      {q.service}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-sub">{q.customer}</td>
                  <td className="px-4 py-3 text-sm font-bold text-text-main">{q.revenue}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'text-sm font-bold',
                      q.margin >= 20 ? 'text-success' : q.margin >= 15 ? 'text-warning' : 'text-danger',
                    )}>
                      {q.margin}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border', statusStyles[q.status])}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusDotColor[q.status] }}/>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[0.6rem] font-bold"
                      style={{ background: avatarGradients[q.owner] ?? '#6B7280' }}
                    >
                      {q.owner}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-sub whitespace-nowrap">{q.updated}</td>
                  <td className="px-4 py-3 pr-5">
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        title="View"
                        onClick={() => router.push('/calculators/final-mile')}
                        className="w-7 h-7 rounded-lg border border-ui-border bg-white flex items-center justify-center text-text-sub hover:bg-gray-50 hover:text-text-main transition-colors"
                      >
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      <button
                        title="Edit"
                        onClick={() => router.push('/calculators/final-mile')}
                        className="w-7 h-7 rounded-lg border border-ui-border bg-white flex items-center justify-center text-text-sub hover:bg-gray-50 hover:text-text-main transition-colors"
                      >
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        title="Export"
                        onClick={() => alert('Quote exported to PDF.')}
                        className="w-7 h-7 rounded-lg border border-ui-border bg-white flex items-center justify-center text-text-sub hover:bg-gray-50 hover:text-text-main transition-colors"
                      >
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </button>
                      {isSuperAdmin && (
                        <button
                          title="Delete"
                          onClick={() => alert(`Quote ${q.id} deleted. (wire to API)`)}
                          className="w-7 h-7 rounded-lg border border-danger/30 bg-white flex items-center justify-center text-danger hover:bg-danger-bg transition-colors"
                        >
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-ui-border">
          <div className="text-sm text-text-sub">
            Showing <strong>1–8</strong> of <strong>47</strong> quotes
          </div>
          <div className="flex items-center gap-1">
            {/* Prev */}
            <button className="w-8 h-8 rounded-lg border border-ui-border bg-white flex items-center justify-center text-text-sub hover:bg-gray-50 transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setActivePage(p)}
                className={cn(
                  'w-8 h-8 rounded-lg border text-sm font-semibold transition-colors',
                  activePage === p
                    ? 'bg-brand border-brand text-white'
                    : 'border-ui-border bg-white text-text-sub hover:bg-gray-50',
                )}
              >
                {p}
              </button>
            ))}
            {/* Next */}
            <button className="w-8 h-8 rounded-lg border border-ui-border bg-white flex items-center justify-center text-text-sub hover:bg-gray-50 transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
