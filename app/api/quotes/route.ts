import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function generateQuoteNumber(): Promise<string> {
  const today = new Date()
  const year = today.getFullYear().toString().slice(-2)
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  
  const lastQuote = await prisma.quote.findFirst({
    where: {
      quoteNumber: {
        startsWith: `Q${year}${month}`
      }
    },
    orderBy: {
      quoteNumber: 'desc'
    }
  })

  let sequence = 1
  if (lastQuote) {
    const lastSequence = parseInt(lastQuote.quoteNumber.slice(-4))
    sequence = lastSequence + 1
  }

  return `Q${year}${month}${sequence.toString().padStart(4, '0')}`
}

export async function GET() {
  const session = await auth()

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
    where: user.role === 'SUPER_ADMIN'
      ? {}
      : { tenantId: user.tenantId },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      lineItems: true,
      location: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return NextResponse.json(quotes)
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      tenant: {
        include: {
          locations: true
        }
      }
    }
  })

  if (!user || !user.tenant) {
    return NextResponse.json({ error: 'User or tenant not found' }, { status: 404 })
  }

  const defaultLocation = user.tenant.locations[0]
  if (!defaultLocation) {
    return NextResponse.json({ error: 'No location found for tenant' }, { status: 400 })
  }

  const body = await request.json()
  const {
    calculatorType,
    projectName,
    customerName,
    customerEmail,
    customerPhone,
    inputs,
    totalCost,
    totalPrice,
    marginPercent,
    notes,
    lineItems
  } = body

  const quoteNumber = await generateQuoteNumber()

  const quote = await prisma.quote.create({
    data: {
      tenantId: user.tenantId,
      locationId: defaultLocation.id,
      userId: user.id,
      quoteNumber,
      calculatorType,
      projectName: projectName || 'Untitled Quote',
      customerName,
      customerEmail,
      customerPhone,
      totalCost,
      totalPrice,
      marginPercent,
      status: 'DRAFT',
      notes,
      metadata: inputs,
      lineItems: {
        create: (lineItems || []).map((item: any, index: number) => ({
          description: item.description,
          quantity: item.quantity,
          unit: item.unit || 'ea',
          unitCost: item.unitCost,
          totalCost: item.totalCost,
          sortOrder: index,
          metadata: item.metadata
        }))
      }
    },
    include: {
      lineItems: true
    }
  })

  return NextResponse.json(quote)
}