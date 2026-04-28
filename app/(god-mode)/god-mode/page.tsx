'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type GodTab = 'All Users' | 'God Mode' | 'Admins' | 'Viewers' | 'Pending'

const tabs: GodTab[] = ['All Users', 'God Mode', 'Admins', 'Viewers', 'Pending']

const users = [
  { name: 'Super Admin',    email: 'super@armstrong.com',   role: 'God Mode', tenant: 'Armstrong HQ',    status: 'Active',  lastLogin: 'Today, 9:02am'  },
  { name: 'John Smith',     email: 'john@armstrong.com',    role: 'Admin',    tenant: 'Armstrong Corp.',  status: 'Active',  lastLogin: 'Today, 8:45am'  },
  { name: 'Sarah Connor',   email: 'sarah@armstrong.com',   role: 'Admin',    tenant: 'Armstrong Corp.',  status: 'Active',  lastLogin: 'Yesterday'      },
  { name: 'Mike Johnson',   email: 'mike@armstrong.com',    role: 'Viewer',   tenant: 'Armstrong Corp.',  status: 'Active',  lastLogin: '2 days ago'     },
  { name: 'Lisa Chen',      email: 'lisa@acme.com',         role: 'Admin',    tenant: 'ACME Logistics',   status: 'Active',  lastLogin: '3 days ago'     },
  { name: 'David Park',     email: 'david@fastfreight.com', role: 'Viewer',   tenant: 'Fast Freight Co.', status: 'Inactive',lastLogin: '2 weeks ago'    },
  { name: 'Pending User',   email: 'pending@partner.com',   role: 'Pending',  tenant: 'Partner Inc.',     status: 'Pending', lastLogin: 'Never'          },
]

const roleStyles: Record<string, string> = {
  'God Mode': 'bg-warning-bg text-warning      border-warning-border',
  'Admin':    'bg-brand-light text-brand       border-brand/20',
  'Viewer':   'bg-gray-100   text-text-sub     border-ui-border',
  'Pending':  'bg-accent-bg  text-accent       border-accent-border',
}

export default function GodModePage() {
  const [activeTab, setActiveTab]   = useState<GodTab>('All Users')
  const [activePage, setActivePage] = useState(1)
  const [addUserOpen, setAddUserOpen] = useState(false)

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-warning-bg text-warning rounded-full text-xs font-bold mb-3 border border-warning-border">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Super Admin — God Mode
          </div>
          <h1 className="font-condensed font-extrabold text-[1.85rem] text-text-main leading-tight">
            User Management
          </h1>
          <p className="text-sm text-text-sub mt-1">
            Manage all users, roles, and permissions across every tenant.
          </p>
        </div>
        <button
          onClick={() => setAddUserOpen(true)}
          className="h-9 px-4 bg-brand hover:bg-brand-pill text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {[
          { label: 'Total Users',   value: '47', color: 'text-text-main' },
          { label: 'God Mode',      value: '1',  color: 'text-warning'   },
          { label: 'Admins',        value: '12', color: 'text-brand'     },
          { label: 'Viewers',       value: '29', color: 'text-text-sub'  },
          { label: 'Pending',       value: '5',  color: 'text-accent'    },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className={`text-2xl font-extrabold font-condensed ${s.color}`}>{s.value}</div>
            <div className="text-xs font-semibold text-text-sub mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        {/* Tabs */}
        <div className="flex items-center gap-1 px-5 py-3 border-b border-ui-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors',
                activeTab === tab
                  ? 'bg-warning-bg text-warning border border-warning-border'
                  : 'text-text-sub hover:bg-gray-100 hover:text-text-main',
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-ui-border">
              {['User', 'Role', 'Tenant', 'Status', 'Last Login', ''].map((h) => (
                <th key={h} className="px-5 py-2.5 text-left text-[0.72rem] font-bold text-text-sub uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="table-row-clickable border-b border-ui-border last:border-0">
                <td className="px-5 py-3">
                  <div className="text-sm font-medium text-text-main">{u.name}</div>
                  <div className="text-xs text-text-sub">{u.email}</div>
                </td>
                <td className="px-5 py-3">
                  <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border', roleStyles[u.role])}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-text-sub">{u.tenant}</td>
                <td className="px-5 py-3">
                  <span className={cn(
                    'text-xs font-semibold px-2 py-0.5 rounded-full border',
                    u.status === 'Active'  ? 'bg-success-bg text-success border-success-border' :
                    u.status === 'Pending' ? 'bg-accent-bg  text-accent  border-accent-border'  :
                    'bg-gray-100 text-text-sub border-ui-border',
                  )}>
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-text-sub">{u.lastLogin}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 rounded-lg border border-ui-border bg-white flex items-center justify-center text-text-sub hover:bg-gray-50 transition-colors" title="Edit">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button className="w-7 h-7 rounded-lg border border-ui-border bg-white flex items-center justify-center text-text-sub hover:bg-gray-50 transition-colors" title="More">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-ui-border">
          <div className="text-sm text-text-sub">Showing <strong>1–7</strong> of <strong>47</strong> users</div>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg border border-ui-border bg-white flex items-center justify-center text-text-sub hover:bg-gray-50 transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            {[1, 2, 3, 4, 5].map((p) => (
              <button
                key={p}
                onClick={() => setActivePage(p)}
                className={cn(
                  'w-8 h-8 rounded-lg border text-sm font-semibold transition-colors',
                  activePage === p
                    ? 'bg-warning border-warning text-white'
                    : 'border-ui-border bg-white text-text-sub hover:bg-gray-50',
                )}
              >
                {p}
              </button>
            ))}
            <button className="w-8 h-8 rounded-lg border border-ui-border bg-white flex items-center justify-center text-text-sub hover:bg-gray-50 transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {addUserOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-ui-border">
              <h2 className="font-condensed font-extrabold text-xl text-text-main">Add User</h2>
              <button onClick={() => setAddUserOpen(false)} className="w-8 h-8 rounded-lg border border-ui-border flex items-center justify-center text-text-sub hover:bg-gray-50">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-text-sub block mb-1">Full Name</label>
                <input type="text" placeholder="Jane Doe" className="w-full h-10 border border-ui-border rounded-lg px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-sub block mb-1">Email</label>
                <input type="email" placeholder="jane@armstrong.com" className="w-full h-10 border border-ui-border rounded-lg px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-sub block mb-1">Role</label>
                <select className="w-full h-10 border border-ui-border rounded-lg px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-colors bg-white">
                  <option value="ADMIN">Admin</option>
                  <option value="USER">Viewer</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-sub block mb-1">Workspace</label>
                <select className="w-full h-10 border border-ui-border rounded-lg px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-colors bg-white">
                  <option>Armstrong Corp.</option>
                  <option>ACME Logistics</option>
                  <option>Fast Freight Co.</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-ui-border">
              <button onClick={() => setAddUserOpen(false)} className="h-9 px-4 border border-ui-border rounded-lg text-sm font-semibold text-text-sub hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => { alert('User invited! (wire to API)'); setAddUserOpen(false) }} className="h-9 px-5 bg-brand hover:bg-brand-pill text-white rounded-lg text-sm font-semibold transition-colors">Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
