'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const profiles = [
  { id: 'CP-001', name: 'Final Mile NE',       location: 'Northeast Hub',  type: 'Final Mile',      laborRate: '$23.76/hr', fuel: '$0.68/mi', status: 'Active',   quotes: 18, updated: 'Apr 20, 2026' },
  { id: 'CP-002', name: 'Hotel Install SE',     location: 'Southeast',      type: 'Installation',    laborRate: '$28.50/hr', fuel: '$0.72/mi', status: 'Active',   quotes: 9,  updated: 'Apr 15, 2026' },
  { id: 'CP-003', name: 'Pallet Midwest',       location: 'Chicago Hub',    type: 'Pallet Handling', laborRate: '$21.40/hr', fuel: '$0.65/mi', status: 'Active',   quotes: 12, updated: 'Apr 10, 2026' },
  { id: 'CP-004', name: 'Warehouse Corporate',  location: 'All Locations',  type: 'Warehouse',       laborRate: '$19.80/hr', fuel: '$0.60/mi', status: 'Active',   quotes: 8,  updated: 'Apr 8, 2026'  },
  { id: 'CP-005', name: 'Final Mile SW',        location: 'Southwest Hub',  type: 'Final Mile',      laborRate: '$22.90/hr', fuel: '$0.71/mi', status: 'Active',   quotes: 6,  updated: 'Apr 5, 2026'  },
  { id: 'CP-006', name: 'Hotel Install NW',     location: 'Northwest',      type: 'Installation',    laborRate: '$29.00/hr', fuel: '$0.74/mi', status: 'Inactive', quotes: 0,  updated: 'Mar 28, 2026' },
]

const typeChip: Record<string, string> = {
  'Final Mile':      'bg-brand-light text-brand      border-brand/20',
  'Installation':    'bg-accent-bg   text-accent     border-accent-border',
  'Pallet Handling': 'bg-orange-50   text-orange-600 border-orange-200',
  'Warehouse':       'bg-success-bg  text-success    border-success-border',
}

function MoreMenu({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (!isSuperAdmin) return null

  return (
    <div ref={ref} className="relative">
      <button
        title="More"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        className="w-7 h-7 rounded-lg border border-ui-border bg-white flex items-center justify-center text-text-sub hover:bg-gray-50 hover:text-text-main transition-colors"
      >
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 w-40 bg-white border border-ui-border rounded-xl shadow-lg py-1 overflow-hidden">
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); alert('Profile deactivated. (wire to API)') }}
            className="w-full text-left px-3 py-2 text-sm text-text-main hover:bg-gray-50 transition-colors"
          >
            Deactivate
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); alert('Profile deleted. (wire to API)') }}
            className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-danger-bg transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default function CostManagementPage() {
  const { data: session } = useSession()
  const isSuperAdmin = session?.user.role === 'SUPER_ADMIN'

  return (
    <>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="font-condensed font-extrabold text-[1.85rem] text-text-main leading-tight">
            Cost Profiles
          </h1>
          <p className="text-sm text-text-sub mt-1">
            Manage labor rates, fuel costs, and overhead allocations by location and service type.
          </p>
        </div>
        <Link
          href="/costs/new"
          className="h-9 px-4 bg-brand hover:bg-brand-pill text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Cost Profile
        </Link>
      </div>

      <div className="card">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-ui-border">
          <div className="text-sm font-semibold text-text-main">{profiles.length} profiles</div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search profiles…"
                className="h-8 pl-8 pr-3 border border-ui-border rounded-lg bg-gray-50 text-sm text-text-main placeholder:text-text-sub outline-none focus:border-brand focus:bg-white transition-colors w-44"
              />
            </div>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-ui-border">
              {['Profile', 'Location', 'Service Type', 'Labor Rate', 'Fuel Rate', 'Status', 'Quotes', 'Updated', ''].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[0.72rem] font-bold text-text-sub uppercase tracking-wider whitespace-nowrap first:pl-5 last:pr-5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="table-row-clickable border-b border-ui-border last:border-0">
                <td className="px-4 py-3 pl-5">
                  <div className="text-sm font-medium text-text-main">{p.name}</div>
                  <div className="text-xs text-text-sub">{p.id}</div>
                </td>
                <td className="px-4 py-3 text-sm text-text-sub">{p.location}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${typeChip[p.type] ?? 'bg-gray-100 text-text-sub border-ui-border'}`}>
                    {p.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-text-main tabular-nums">{p.laborRate}</td>
                <td className="px-4 py-3 text-sm font-semibold text-text-main tabular-nums">{p.fuel}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${p.status === 'Active' ? 'bg-success-bg text-success border-success-border' : 'bg-gray-100 text-text-sub border-ui-border'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-text-main tabular-nums">{p.quotes}</td>
                <td className="px-4 py-3 text-xs text-text-sub whitespace-nowrap">{p.updated}</td>
                <td className="px-4 py-3 pr-5">
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Link
                      href="/costs/new"
                      title="Edit"
                      onClick={(e) => e.stopPropagation()}
                      className="w-7 h-7 rounded-lg border border-ui-border bg-white flex items-center justify-center text-text-sub hover:bg-gray-50 hover:text-text-main transition-colors"
                    >
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </Link>
                    <MoreMenu isSuperAdmin={isSuperAdmin} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
