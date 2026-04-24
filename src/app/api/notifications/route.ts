import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }))
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: any = {}
  try {
    body = await req.json()
  } catch {
    // no body = mark all read
  }

  if (!body?.id) {
    // Mark all as read
    await prisma.notification.updateMany({ data: { read: true } })
    return NextResponse.json({ success: true, markedAll: true })
  }

  return NextResponse.json(await prisma.notification.update({ where: { id: body.id }, data: { read: true } }))
}
