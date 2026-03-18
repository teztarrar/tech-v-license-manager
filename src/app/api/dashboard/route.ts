import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [total, active, expiring, expired, recentLicenses, products, companies] = await Promise.all([
    prisma.license.count(),
    prisma.license.count({ where: { status: 'ACTIVE' } }),
    prisma.license.count({ where: { status: 'EXPIRING' } }),
    prisma.license.count({ where: { status: 'EXPIRED' } }),
    prisma.license.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { company: true, product: true },
    }),
    prisma.product.findMany({ include: { _count: { select: { licenses: true } } } }),
    prisma.company.count(),
  ])

  // Build expiry timeline (next 12 months)
  const now = new Date()
  const timeline = []
  for (let i = 0; i < 12; i++) {
    const start = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() + i + 1, 0)
    const count = await prisma.license.count({
      where: { expiryDate: { gte: start, lte: end } },
    })
    timeline.push({
      month: start.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      expiring: count,
    })
  }

  // Revenue by product
  const revenueData = await prisma.product.findMany({
    include: { _count: { select: { licenses: true } } },
    where: { price: { not: null } },
  })

  const revenue = revenueData.map(p => ({
    name: p.name,
    revenue: (p.price || 0) * p._count.licenses,
    licenses: p._count.licenses,
  }))

  return NextResponse.json({
    stats: { total, active, expiring, expired, companies },
    timeline,
    productDistribution: products.map(p => ({ name: p.name, value: p._count.licenses })),
    revenue,
    recentLicenses,
  })
}
