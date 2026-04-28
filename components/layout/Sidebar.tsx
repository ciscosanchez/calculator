'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

// ── Icon registry (kept client-side — never serialized across RSC boundary) ───

type IconKey =
  | 'dashboard' | 'calculators' | 'scenarios' | 'quotes' | 'costs'
  | 'settings' | 'godMode' | 'users' | 'systemConfig' | 'exit' | 'lock'

const ICONS: Record<IconKey, React.ReactNode> = {
  dashboard: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  calculators: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/>
      <rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>
    </svg>
  ),
  scenarios: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  quotes: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  costs: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  settings: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  godMode: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  users: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  systemConfig: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  exit: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  lock: (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NavItem {
  href:    string
  label:   string
  icon:    IconKey
  locked?: boolean
  badge?:  string
}

interface SidebarProps {
  variant?:          'default' | 'god-mode'
  navItems:          NavItem[]
  footerItems?:      NavItem[]
  userName?:         string
  userInitials?:     string
  collapsed?:        boolean
  onToggleCollapse?: () => void
  onSignOut?:        () => void
}

// ── NavLink ───────────────────────────────────────────────────────────────────

function NavLink({ item, variant, collapsed }: { item: NavItem; variant: 'default' | 'god-mode'; collapsed?: boolean }) {
  const pathname = usePathname()

  const isActive =
    item.href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(item.href)

  const activeClass =
    variant === 'god-mode'
      ? 'bg-warning/20 text-warning-border font-semibold border border-warning/25'
      : 'bg-brand-pill text-white font-semibold'

  return (
    <Link
      href={item.locked ? '#' : item.href}
      aria-disabled={item.locked}
      className={cn(
        'flex items-center rounded-lg text-sm font-medium transition-all duration-150',
        collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2.5',
        'text-white/55 hover:bg-white/7 hover:text-white/90',
        isActive && activeClass,
        item.locked && 'opacity-40 cursor-not-allowed pointer-events-none',
      )}
    >
      <span className="flex-shrink-0">{ICONS[item.icon]}</span>
      {!collapsed && <span>{item.label}</span>}
      {!collapsed && item.badge && (
        <span className="ml-auto text-[0.65rem] font-semibold text-white/40 tracking-wider">
          {item.badge}
        </span>
      )}
      {!collapsed && item.locked && <span className="ml-auto opacity-60">{ICONS.lock}</span>}
    </Link>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export default function Sidebar({
  variant      = 'default',
  navItems,
  footerItems,
  userName,
  userInitials = 'JS',
  collapsed    = false,
  onToggleCollapse,
  onSignOut,
}: SidebarProps) {
  const glowColor =
    variant === 'god-mode' ? 'rgba(217,119,6,0.18)' : 'rgba(37,99,235,0.15)'

  return (
    <aside
      className={cn(
        'bg-navy fixed top-0 left-0 h-screen z-50 flex flex-col overflow-hidden transition-[width] duration-200',
        collapsed ? 'w-[64px]' : 'w-sidebar min-w-sidebar',
      )}
      style={{ isolation: 'isolate' }}
    >
      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-60px', left: '-60px', width: '300px', height: '300px',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 65%)`,
        }}
      />

      {/* Logo */}
      <div className={cn(
        'py-5 border-b border-white/8 flex items-center relative z-10',
        collapsed ? 'justify-center px-0' : 'px-5 gap-2.5',
      )}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0 }}>
          <rect width="36" height="36" rx="8" fill="#1D4ED8"/>
          <path d="M18 7L29 27H7L18 7Z" fill="white" opacity="0.9"/>
          <path d="M18 14L23 24H13L18 14Z" fill="#1D4ED8"/>
        </svg>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-condensed font-extrabold text-base text-white tracking-[0.08em] leading-tight">ARMSTRONG</span>
            <span className="text-[0.65rem] font-semibold text-white/45 tracking-[0.14em] uppercase">PRICING</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3.5 flex flex-col gap-0.5 overflow-y-auto sidebar-nav relative z-10">
        {/* Toggle button */}
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 text-white/40 hover:text-white/80 hover:bg-white/7 rounded-lg transition-colors mb-1"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {navItems.map((item) => (
          <NavLink key={item.href} item={item} variant={variant} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2.5 py-3.5 border-t border-white/8 flex flex-col gap-0.5 relative z-10">
        {footerItems?.map((item) => (
          <NavLink key={item.href} item={item} variant={variant} collapsed={collapsed} />
        ))}
        <div className={cn(
          'flex items-center px-3 py-2.5 mt-1',
          collapsed ? 'justify-center' : 'gap-2.5',
        )}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
          >
            {userInitials}
          </div>
          {!collapsed && userName && <span className="text-sm text-white/55 truncate">{userName}</span>}
        </div>
        {/* Sign Out */}
        <button
          onClick={onSignOut}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:bg-white/7 hover:text-white/70 transition-all w-full"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
