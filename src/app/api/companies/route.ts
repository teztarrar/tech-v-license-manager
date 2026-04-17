import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const companies = await prisma.company.findMany({
    include: { _count: { select: { licenses: true } } },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(companies)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, location, contactPerson, email, phone } = body
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const company = await prisma.company.create({
    data: { name, location, contactPerson, email, phone, workspaceId: 'default' },
  })
  return NextResponse.json(company)
}
