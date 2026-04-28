import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { tenant: true }
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const quotes = await prisma.quote.findMany({
    where: user.role === 'SUPER_ADMIN' && !user.tenantId
      ? {}
      : { user: { tenantId: user.tenantId } },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      lineItems: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return NextResponse.json(quotes)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const body = await request.json()
  const {
    calculatorType,
    projectName,
    customerName,
    inputs,
    totalCost,
    revenue,
    margin,
    notes,
    lineItems
  } = body

  const quote = await prisma.quote.create({
    data: {
      userId: user.id,
      calculatorType,
      projectName,
      customerName,
      inputs,
      totalCost,
      revenue,
      margin,
      status: 'DRAFT',
      notes,
      lineItems: {
        create: lineItems || []
      }
    },
    include: {
      lineItems: true
    }
  })

  return NextResponse.json(quote)
}
