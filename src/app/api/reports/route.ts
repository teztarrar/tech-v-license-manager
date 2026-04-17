import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [total, active, expiring, expired] = await Promise.all([
    prisma.license.count(),
    prisma.license.count({ where: { status: 'ACTIVE' } }),
    prisma.license.count({ where: { status: 'EXPIRING' } }),
    prisma.license.count({ where: { status: 'EXPIRED' } }),
  ])
  const products = await prisma.product.findMany({ include: { licenses: true } })
  const productDist = products.map(p => ({ name: p.name, count: p.licenses.length, value: (p.price || 0) * p.licenses.length }))
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0) * p.licenses.length, 0)
  return NextResponse.json({ total, active, expiring, expired, productDist, totalValue })
}
