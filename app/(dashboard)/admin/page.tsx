import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'

export const metadata: Metadata = { title: 'Admin' }

const users = [
  { name: 'John Smith',     email: 'john@armstrong.com',     role: 'Admin', location: 'Northeast Hub',  status: 'Active',   lastLogin: 'Today, 9:02am'   },
  { name: 'Sarah Connor',   email: 'sarah@armstrong.com',    role: 'User',  location: 'Southeast',      status: 'Active',   lastLogin: 'Today, 8:45am'   },
  { name: 'Mike Johnson',   email: 'mike@armstrong.com',     role: 'Admin', location: 'Chicago Hub',    status: 'Active',   lastLogin: 'Yesterday'       },
  { name: 'Lisa Chen',      email: 'lisa@armstrong.com',     role: 'User',  location: 'Northwest',      status: 'Active',   lastLogin: '2 days ago'      },
  { name: 'David Park',     email: 'david@armstrong.com',    role: 'User',  location: 'Southwest Hub',  status: 'Inactive', lastLogin: '2 weeks ago'     },
]

const roleStyles: Record<string, string> = {
  Admin: 'bg-brand-light text-brand   border-brand/20',
  User:  'bg-gray-100   text-text-sub border-ui-border',
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  const isSuperAdmin = session?.user.role === 'SUPER_ADMIN'

  return (
    <>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-brand-light text-brand rounded-full text-xs font-bold mb-3 border border-brand/20">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Admin View
          </div>
          <h1 className="font-condensed font-extrabold text-[1.85rem] text-text-main leading-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-text-sub mt-1">
            Manage users, locations, and company-level settings for Armstrong Corporate.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users',      value: '12', icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>, color: 'bg-brand-light text-brand'    },
          { label: 'Active Locations', value: '4',  icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, color: 'bg-success-bg text-success'  },
          { label: 'Cost Profiles',    value: '6',  icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, color: 'bg-warning-bg text-warning'   },
          { label: 'Quotes (30d)',     value: '23', icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, color: 'bg-accent-bg text-accent'     },
        ].map((s) => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <div className="text-2xl font-extrabold font-condensed text-text-main">{s.value}</div>
              <div className="text-xs font-semibold text-text-sub">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="card">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-ui-border">
          <div className="font-semibold text-text-main">Users</div>
          {isSuperAdmin ? (
            <button className="h-8 px-3 bg-brand hover:bg-brand-pill text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Invite User
            </button>
          ) : (
            <span className="text-xs text-text-sub font-medium px-2.5 py-1 bg-gray-100 rounded-lg border border-ui-border">
              Read-only
            </span>
          )}
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-ui-border">
              {['User', 'Role', 'Location', 'Status', 'Last Login', isSuperAdmin ? '' : undefined]
                .filter(Boolean)
                .map((h, i) => (
                  <th key={i} className="px-5 py-2.5 text-left text-[0.72rem] font-bold text-text-sub uppercase tracking-wider">
                    {h}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-b border-ui-border last:border-0 hover:bg-gray-50/50">
                <td className="px-5 py-3">
                  <div className="text-sm font-medium text-text-main">{u.name}</div>
                  <div className="text-xs text-text-sub">{u.email}</div>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roleStyles[u.role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-text-sub">{u.location}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${u.status === 'Active' ? 'bg-success-bg text-success border-success-border' : 'bg-gray-100 text-text-sub border-ui-border'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-text-sub">{u.lastLogin}</td>
                {isSuperAdmin && (
                  <td className="px-5 py-3">
                    <button className="w-7 h-7 rounded-lg border border-ui-border bg-white flex items-center justify-center text-text-sub hover:bg-gray-50 transition-colors">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
