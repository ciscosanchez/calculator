import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { redirect } from 'next/navigation'

export default async function RootPage() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/login')

  if (session.user.role === 'SUPER_ADMIN') redirect('/god-mode')
  if (session.user.role === 'USER')        redirect('/viewer')
  redirect('/dashboard')
}
