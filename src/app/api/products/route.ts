import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const products = await prisma.product.findMany({
    include: { _count: { select: { licenses: true } } },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, vendor, licenseType, renewalCycle, price } = body
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const product = await prisma.product.create({
    data: {
      name, vendor, licenseType, renewalCycle,
      price: price ? parseFloat(price) : null,
      workspaceId: 'default',
    },
  })
  return NextResponse.json(product)
}
