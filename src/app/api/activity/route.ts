import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // Activity logging requires an activityLog table in the schema.
  // For now, return an empty array so the UI works.
  return NextResponse.json([])
}

