import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { redirect } from 'next/navigation'
import ShellWrapper from '@/components/layout/ShellWrapper'
import type { NavItem } from '@/components/layout/Sidebar'

const navItems: NavItem[] = [
  { href: '/dashboard',   label: 'Dashboard',           icon: 'dashboard'   },
  { href: '/calculators', label: 'Pricing Calculators', icon: 'calculators' },
  { href: '/scenarios',   label: 'Scenario Builder',    icon: 'scenarios'   },
  { href: '/quotes',      label: 'Quotes',              icon: 'quotes'      },
  { href: '/costs',       label: 'Cost Profiles',       icon: 'costs'       },
]

const footerItems: NavItem[] = [
  { href: '/settings', label: 'Settings', icon: 'settings' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session)                        redirect('/login')
  if (session.user.role === 'USER')    redirect('/viewer')

  return (
    <ShellWrapper
      variant="default"
      navItems={navItems}
      footerItems={footerItems}
      userInitials={session.user.initials}
      userName={session.user.name ?? session.user.email ?? ''}
    >
      {children}
    </ShellWrapper>
  )
}
