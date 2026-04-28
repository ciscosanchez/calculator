'use client'

import { useState } from 'react'

type SettingsTab = 'profile' | 'notifications' | 'appearance' | 'security'

const NAV_ITEMS: { key: SettingsTab; label: string }[] = [
  { key: 'profile',       label: 'Profile'       },
  { key: 'notifications', label: 'Notifications' },
  { key: 'appearance',    label: 'Appearance'    },
  { key: 'security',      label: 'Security'      },
]

// ── Toggle row ────────────────────────────────────────────────────────────────

function ToggleRow({ label, defaultChecked = true }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-ui-border last:border-0">
      <span className="text-sm text-text-main">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand/20 rounded-full peer peer-checked:bg-brand transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
      </label>
    </div>
  )
}

// ── Tab: Profile ──────────────────────────────────────────────────────────────

function ProfileTab() {
  return (
    <div>
      <div className="text-base font-semibold text-text-main mb-5">Profile Settings</div>
      <div className="flex flex-col gap-4 max-w-md">
        <div>
          <label className="text-xs font-semibold text-text-sub block mb-1">Full Name</label>
          <input
            type="text"
            defaultValue="John Smith"
            className="w-full h-10 border border-ui-border rounded-lg px-3 text-sm text-text-main outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-colors bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-sub block mb-1">Email</label>
          <input
            type="email"
            defaultValue="j.smith@armstrong.com"
            className="w-full h-10 border border-ui-border rounded-lg px-3 text-sm text-text-main outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-colors bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-sub block mb-1">Role</label>
          <input
            type="text"
            defaultValue="Admin"
            disabled
            className="w-full h-10 border border-ui-border rounded-lg px-3 text-sm text-text-sub bg-gray-50 cursor-not-allowed"
          />
        </div>
        <div className="pt-2">
          <button className="h-9 px-5 bg-brand hover:bg-brand-pill text-white rounded-lg text-sm font-semibold transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Tab: Notifications ────────────────────────────────────────────────────────

function NotificationsTab() {
  return (
    <div className="flex flex-col gap-7">
      <div>
        <div className="text-base font-semibold text-text-main mb-1">Email Notifications</div>
        <p className="text-sm text-text-sub mb-4">Choose which events trigger an email to your inbox.</p>
        <div className="max-w-md">
          <ToggleRow label="New quote accepted" defaultChecked={true} />
          <ToggleRow label="Quote sent" defaultChecked={true} />
          <ToggleRow label="Cost profile updated" defaultChecked={false} />
        </div>
      </div>
      <div>
        <div className="text-base font-semibold text-text-main mb-1">In-App Notifications</div>
        <p className="text-sm text-text-sub mb-4">Control which alerts appear in the notification bell.</p>
        <div className="max-w-md">
          <ToggleRow label="System health alerts" defaultChecked={true} />
          <ToggleRow label="New user added" defaultChecked={true} />
          <ToggleRow label="Fuel rate changes" defaultChecked={true} />
        </div>
      </div>
    </div>
  )
}

// ── Tab: Appearance ───────────────────────────────────────────────────────────

function AppearanceTab() {
  const [theme, setTheme]     = useState<'light' | 'dark'>('light')
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable')

  return (
    <div className="flex flex-col gap-7 max-w-md">
      {/* Theme */}
      <div>
        <div className="text-base font-semibold text-text-main mb-1">Theme</div>
        <p className="text-sm text-text-sub mb-4">Select how the interface looks.</p>
        <div className="grid grid-cols-2 gap-3">
          <label className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 cursor-pointer transition-colors ${theme === 'light' ? 'border-brand bg-brand-light' : 'border-ui-border bg-white hover:bg-gray-50'}`}>
            <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={() => setTheme('light')} className="sr-only" />
            <div className="w-full h-14 bg-white rounded-lg border border-ui-border shadow-sm flex flex-col gap-1 p-2 overflow-hidden">
              <div className="h-2 w-3/4 bg-gray-200 rounded" />
              <div className="h-2 w-1/2 bg-gray-100 rounded" />
            </div>
            <span className={`text-sm font-semibold ${theme === 'light' ? 'text-brand' : 'text-text-sub'}`}>Light</span>
          </label>
          <label className="flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 border-ui-border bg-gray-50 cursor-not-allowed opacity-50">
            <input type="radio" name="theme" value="dark" disabled className="sr-only" />
            <div className="w-full h-14 bg-gray-800 rounded-lg flex flex-col gap-1 p-2 overflow-hidden">
              <div className="h-2 w-3/4 bg-gray-600 rounded" />
              <div className="h-2 w-1/2 bg-gray-700 rounded" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-text-sub">Dark</span>
              <span className="text-[0.6rem] font-bold px-1.5 py-0.5 bg-gray-200 text-text-sub rounded-full uppercase tracking-wide">Soon</span>
            </div>
          </label>
        </div>
      </div>

      {/* Density */}
      <div>
        <div className="text-base font-semibold text-text-main mb-1">Density</div>
        <p className="text-sm text-text-sub mb-4">Control how compact the layout feels.</p>
        <div className="flex flex-col gap-2">
          {(['comfortable', 'compact'] as const).map((d) => (
            <label key={d} className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-colors ${density === d ? 'border-brand bg-brand-light' : 'border-ui-border bg-white hover:bg-gray-50'}`}>
              <input type="radio" name="density" value={d} checked={density === d} onChange={() => setDensity(d)} className="sr-only" />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${density === d ? 'border-brand' : 'border-gray-300'}`}>
                {density === d && <div className="w-2 h-2 rounded-full bg-brand" />}
              </div>
              <span className={`text-sm font-semibold capitalize ${density === d ? 'text-brand' : 'text-text-main'}`}>{d}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Tab: Security ─────────────────────────────────────────────────────────────

function SecurityTab() {
  return (
    <div className="flex flex-col gap-8 max-w-md">
      {/* Change password */}
      <div>
        <div className="text-base font-semibold text-text-main mb-1">Change Password</div>
        <p className="text-sm text-text-sub mb-4">Update your password to keep your account secure.</p>
        <div className="flex flex-col gap-3.5">
          <div>
            <label className="text-xs font-semibold text-text-sub block mb-1">Current Password</label>
            <input type="password" placeholder="••••••••" className="w-full h-10 border border-ui-border rounded-lg px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-colors bg-white" />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-sub block mb-1">New Password</label>
            <input type="password" placeholder="••••••••" className="w-full h-10 border border-ui-border rounded-lg px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-colors bg-white" />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-sub block mb-1">Confirm Password</label>
            <input type="password" placeholder="••••••••" className="w-full h-10 border border-ui-border rounded-lg px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-colors bg-white" />
          </div>
          <div className="pt-1">
            <button className="h-9 px-5 bg-brand hover:bg-brand-pill text-white rounded-lg text-sm font-semibold transition-colors">
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Sessions */}
      <div>
        <div className="text-base font-semibold text-text-main mb-1">Sessions</div>
        <p className="text-sm text-text-sub mb-4">Manage where you are currently signed in.</p>
        <div className="border border-ui-border rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-ui-border">
                <th className="px-4 py-2.5 text-left text-[0.72rem] font-bold text-text-sub uppercase tracking-wider">Session</th>
                <th className="px-4 py-2.5 text-left text-[0.72rem] font-bold text-text-sub uppercase tracking-wider">Device</th>
                <th className="px-4 py-2.5 text-left text-[0.72rem] font-bold text-text-sub uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 text-sm text-text-main font-medium">Current Session</td>
                <td className="px-4 py-3 text-sm text-text-sub">This device</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-success-bg text-success border-success-border">Active now</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-3">
          <button
            onClick={() => alert('All other sessions signed out. (wire to API)')}
            className="h-9 px-4 border border-ui-border rounded-lg text-sm font-semibold text-text-sub hover:bg-gray-50 transition-colors"
          >
            Sign out all other sessions
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  return (
    <>
      <div className="mb-6">
        <h1 className="font-condensed font-extrabold text-[1.85rem] text-text-main leading-tight">Settings</h1>
        <p className="text-sm text-text-sub mt-1">Manage your account, notifications, and preferences.</p>
      </div>

      <div className="grid grid-cols-[240px_1fr] gap-6">
        {/* Settings nav */}
        <div className="card p-2 h-fit">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.key
                  ? 'bg-brand-light text-brand font-semibold'
                  : 'text-text-sub hover:bg-gray-50 hover:text-text-main'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Settings panel */}
        <div className="card p-6">
          {activeTab === 'profile'       && <ProfileTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'appearance'    && <AppearanceTab />}
          {activeTab === 'security'      && <SecurityTab />}
        </div>
      </div>
    </>
  )
}
