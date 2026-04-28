'use client'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import type { NavItem } from './Sidebar'

interface ShellWrapperProps {
  variant?:      'default' | 'god-mode'
  navItems:      NavItem[]
  footerItems?:  NavItem[]
  userInitials:  string
  userName:      string
  children:      React.ReactNode
}

export default function ShellWrapper({ variant = 'default', navItems, footerItems, userInitials, userName, children }: ShellWrapperProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar
        variant={variant}
        navItems={navItems}
        footerItems={footerItems}
        userInitials={userInitials}
        userName={userName}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(c => !c)}
        onSignOut={() => signOut({ callbackUrl: '/v2/login' })}
      />
      <div
        className="flex-1 flex flex-col min-h-screen transition-[margin-left] duration-200"
        style={{ marginLeft: collapsed ? 64 : 220 }}
      >
        <Topbar variant={variant} />
        <main className="flex-1 p-7">{children}</main>
      </div>
    </div>
  )
}
