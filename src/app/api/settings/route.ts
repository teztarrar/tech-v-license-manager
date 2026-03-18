import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({}, { status: 401 })
  }

  // 👉 USE DEFAULT WORKSPACE (from seed)
  const workspaceId = 'default'

  const settings = await prisma.setting.findMany({
    where: { workspaceId }
  })

  return NextResponse.json(
    Object.fromEntries(settings.map(s => [s.key, s.value]))
  )
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()

  // 👉 USE DEFAULT WORKSPACE
  const workspaceId = 'default'

  for (const [key, value] of Object.entries(data)) {
    await prisma.setting.upsert({
      where: {
        key_workspaceId: {
          key,
          workspaceId,
        },
      },
      update: {
        value: String(value),
      },
      create: {
        key,
        value: String(value),
        workspaceId,
      },
    })
  }

  return NextResponse.json({ ok: true })
}