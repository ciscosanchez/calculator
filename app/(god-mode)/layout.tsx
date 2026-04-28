import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { redirect } from 'next/navigation'
import ShellWrapper from '@/components/layout/ShellWrapper'
import type { NavItem } from '@/components/layout/Sidebar'

const navItems: NavItem[] = [
  { href: '/dashboard',   label: 'Dashboard',           icon: 'dashboard'    },
  { href: '/calculators', label: 'Pricing Calculators', icon: 'calculators'  },
  { href: '/scenarios',   label: 'Scenario Builder',    icon: 'scenarios'    },
  { href: '/quotes',      label: 'Quotes',              icon: 'quotes'       },
  { href: '/costs',       label: 'Cost Profiles',       icon: 'costs'        },
  { href: '/god-mode',    label: 'God Mode',            icon: 'godMode'      },
  { href: '/admin',       label: 'All Users',           icon: 'users'        },
  { href: '/settings',    label: 'System Config',       icon: 'systemConfig' },
]

const footerItems: NavItem[] = [
  { href: '/dashboard', label: 'Exit God Mode', icon: 'exit' },
]

export default async function GodModeLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session)                                redirect('/login')
  if (session.user.role !== 'SUPER_ADMIN')     redirect('/dashboard')

  return (
    <ShellWrapper
      variant="god-mode"
      navItems={navItems}
      footerItems={footerItems}
      userInitials={session.user.initials}
      userName={session.user.name ?? session.user.email ?? ''}
    >
      {children}
    </ShellWrapper>
  )
}
