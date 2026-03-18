import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkExpiringLicenses } from '@/lib/scheduler'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await checkExpiringLicenses()
  return NextResponse.json({ success: true, message: 'License check completed' })
}
