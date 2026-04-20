import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const quote = await prisma.quote.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      lineItems: {
        orderBy: { sortOrder: 'asc' },
      },
      location: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!quote) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
  }

  if (user.role !== 'SUPER_ADMIN' && quote.tenantId !== user.tenantId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(quote)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const existingQuote = await prisma.quote.findUnique({
    where: { id: params.id },
  })

  if (!existingQuote) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
  }

  if (user.role !== 'SUPER_ADMIN' && existingQuote.tenantId !== user.tenantId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const {
    projectName,
    customerName,
    customerEmail,
    customerPhone,
    totalCost,
    totalPrice,
    marginPercent,
    status,
    notes,
    lineItems,
  } = body

  const quote = await prisma.quote.update({
    where: { id: params.id },
    data: {
      projectName,
      customerName,
      customerEmail,
      customerPhone,
      totalCost,
      totalPrice,
      marginPercent,
      status,
      notes,
      lineItems: lineItems ? {
        deleteMany: {},
        create: lineItems.map((item: any, index: number) => ({
          description: item.description,
          quantity: item.quantity,
          unit: item.unit || 'ea',
          unitCost: item.unitCost,
          totalCost: item.totalCost,
          sortOrder: index,
          metadata: item.metadata,
        })),
      } : undefined,
    },
    include: {
      lineItems: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  return NextResponse.json(quote)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const existingQuote = await prisma.quote.findUnique({
    where: { id: params.id },
  })

  if (!existingQuote) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
  }

  if (user.role !== 'SUPER_ADMIN' && existingQuote.tenantId !== user.tenantId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.quote.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ success: true })
}
