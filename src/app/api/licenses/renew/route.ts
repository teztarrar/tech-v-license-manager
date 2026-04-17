import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, months } = await req.json()
  const license = await prisma.license.findUnique({ where: { id } })
  if (!license) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const currentExpiry = license.expiryDate ? new Date(license.expiryDate) : new Date()
  const newExpiry = new Date(currentExpiry)
  newExpiry.setMonth(newExpiry.getMonth() + (parseInt(months) || 12))

  const updated = await prisma.license.update({
    where: { id },
    data: { expiryDate: newExpiry, status: 'ACTIVE' },
    include: { company: true, product: true },
  })

  await prisma.notification.create({
    data: { type: 'RENEWED', message: `License ${license.licenseKey} renewed until ${newExpiry.toLocaleDateString()}`, licenseId: id },
  })

  return NextResponse.json(updated)
}
