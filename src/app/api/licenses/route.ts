import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getLicenseStatus } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const companyId = searchParams.get('companyId') || ''
  const productId = searchParams.get('productId') || ''

  const where: any = {}
  if (search) {
    where.OR = [
      { licenseKey: { contains: search } },
      { serialNumber: { contains: search } },
      { location: { contains: search } },
    ]
  }
  if (status) where.status = status
  if (companyId) where.companyId = companyId
  if (productId) where.productId = productId

  const licenses = await prisma.license.findMany({
    where,
    include: { company: true, product: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(licenses)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { licenseKey, serialNumber, location, purchaseDate, expiryDate, notes, companyId, productId } = body

  if (!licenseKey) return NextResponse.json({ error: 'License key required' }, { status: 400 })

  const status = getLicenseStatus(expiryDate)

  const license = await prisma.license.create({
    data: {
      licenseKey, serialNumber, location, notes, status,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      companyId: companyId || null,
      productId: productId || null,
      workspaceId: 'default',
    },
    include: { company: true, product: true },
  })
  return NextResponse.json(license)
}
