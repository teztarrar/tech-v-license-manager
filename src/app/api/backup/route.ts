import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [licenses, companies, products, notifications] = await Promise.all([
    prisma.license.findMany({ include: { company: true, product: true } }),
    prisma.company.findMany(),
    prisma.product.findMany(),
    prisma.notification.findMany(),
  ])
  const backup = { exported_at: new Date().toISOString(), licenses, companies, products, notifications }
  return new NextResponse(JSON.stringify(backup, null, 2), { headers: { 'Content-Type': 'application/json', 'Content-Disposition': `attachment; filename="techv-backup-${Date.now()}.json"` } })
}
