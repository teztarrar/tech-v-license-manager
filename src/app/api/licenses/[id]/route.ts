import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getLicenseStatus } from '@/lib/utils'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const license = await prisma.license.findUnique({
    where: { id: params.id },
    include: { company: true, product: true },
  })
  if (!license) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(license)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { licenseKey, serialNumber, location, purchaseDate, expiryDate, notes, companyId, productId } = body
  const status = getLicenseStatus(expiryDate)

  const license = await prisma.license.update({
    where: { id: params.id },
    data: {
      licenseKey, serialNumber, location, notes, status,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      companyId: companyId || null,
      productId: productId || null,
    },
    include: { company: true, product: true },
  })
  return NextResponse.json(license)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.notification.deleteMany({ where: { licenseId: params.id } })
  await prisma.license.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
