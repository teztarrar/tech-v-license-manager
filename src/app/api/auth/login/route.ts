import { NextRequest, NextResponse } from 'next/server'
// This route is not used - NextAuth handles login via /api/auth/[...nextauth]
export async function POST(req: NextRequest) {
  return NextResponse.json({ error: 'Use /api/auth/signin instead' }, { status: 400 })
}
