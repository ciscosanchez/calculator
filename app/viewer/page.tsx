'use client'

import { useSession } from 'next-auth/react'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import type { NavItem } from '@/components/layout/Sidebar'

const navItems: NavItem[] = [
  { href: '/dashboard',   label: 'Dashboard',           icon: 'dashboard'                                     },
  { href: '/calculators', label: 'Pricing Calculators', icon: 'calculators', locked: true                    },
  { href: '/quotes',      label: 'Quotes',              icon: 'quotes',      badge: 'VIEW ONLY'              },
  { href: '/scenarios',   label: 'Scenario Builder',    icon: 'scenarios',   locked: true                    },
  { href: '/costs',       label: 'Cost Profiles',       icon: 'costs',       locked: true                    },
]

const footerItems: NavItem[] = [
  { href: '/settings', label: 'Settings', icon: 'settings' },
]

const quotes = [
  { id: 'ARW-2026-00047', name: 'Hyatt Centric — FF&E Install',  service: 'Hotel Install', revenue: '$42,580', margin: 23.5, status: 'Draft',    updated: 'Apr 23, 2026' },
  { id: 'ARW-2026-00046', name: 'Amazon Final Mile — Charlotte',  service: 'Final Mile',   revenue: '$2,470',  margin: 18.2, status: 'Sent',     updated: 'Apr 22, 2026' },
  { id: 'ARW-2026-00045', name: 'Wayfair Pallet Handling — Q2',   service: 'Pallet',       revenue: '$6,750',  margin: 25.8, status: 'Accepted', updated: 'Apr 20, 2026' },
]

const lockedCards = [
  { title: 'Pricing Calculators', desc: 'Create and price new quotes', icon: 'calculators' },
  { title: 'Scenario Builder',    desc: 'What-if margin analysis',    icon: 'scenarios'   },
  { title: 'Cost Profiles',       desc: 'Manage rates and overhead',  icon: 'costs'       },
]

export default function ViewerPage() {
  const { data: session } = useSession()

  return (
    <div className="flex min-h-screen">
      <Sidebar
        navItems={navItems}
        footerItems={footerItems}
        userInitials={session?.user.initials ?? '??'}
        userName={session?.user.name ?? session?.user.email ?? ''}
      />
      <div className="ml-[220px] flex-1 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-7">

          {/* Viewer banner */}
          <div className="bg-gray-100 border border-ui-border rounded-xl px-5 py-3.5 flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <svg width="14" height="14" fill="none" stroke="#6B7280" strokeWidth="2.5" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-text-main">Viewer Access</div>
                <div className="text-xs text-text-sub">You have read-only access. Contact your Admin to request elevated permissions.</div>
              </div>
            </div>
            <button
              onClick={() => alert('Access request sent to your workspace Admin.')}
              className="h-8 px-3 border border-ui-border rounded-lg bg-white text-xs font-semibold text-text-main hover:bg-gray-50 transition-colors"
            >
              Request Access
            </button>
          </div>

          <div className="flex items-start justify-between mb-4">
            <h1 className="font-condensed font-extrabold text-[1.85rem] text-text-main leading-tight">Quotes</h1>
            <button
              disabled
              className="h-9 px-4 bg-gray-200 text-gray-400 rounded-lg text-sm font-semibold cursor-not-allowed flex items-center gap-1.5"
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              New Quote
            </button>
          </div>

          <div className="card opacity-90 mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-ui-border">
                  {['Quote / Project', 'Service', 'Revenue', 'Margin', 'Status', 'Updated'].map((h) => (
                    <th key={h} className="px-5 py-2.5 text-left text-[0.72rem] font-bold text-text-sub uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr key={q.id} className="border-b border-ui-border last:border-0 cursor-default">
                    <td className="px-5 py-3">
                      <div className="text-sm font-medium text-text-main">{q.name}</div>
                      <div className="text-xs text-text-sub">{q.id}</div>
                    </td>
                    <td className="px-5 py-3 text-sm text-text-sub">{q.service}</td>
                    <td className="px-5 py-3 text-sm font-bold text-text-main">{q.revenue}</td>
                    <td className="px-5 py-3 text-sm font-bold text-success">{q.margin}%</td>
                    <td className="px-5 py-3 text-xs font-semibold text-text-sub">{q.status}</td>
                    <td className="px-5 py-3 text-xs text-text-sub">{q.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Locked feature cards */}
          <div className="grid grid-cols-3 gap-4">
            {lockedCards.map((card) => (
              <div key={card.title} className="card p-5 opacity-50 cursor-not-allowed select-none">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3 text-text-sub">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div className="font-semibold text-text-main mb-1">{card.title}</div>
                <div className="text-xs text-text-sub mb-3">{card.desc}</div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-text-sub border border-ui-border rounded-lg px-3 py-1.5 w-fit bg-gray-50">
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Request Access
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  )
}
