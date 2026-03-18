import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function parseCsv(text: string) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/ /g,'_'))
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g,''))
    return Object.fromEntries(headers.map((h,i) => [h, vals[i] || '']))
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const text = await req.text()
  const rows = parseCsv(text)
  let imported = 0
  for (const row of rows) {
    try {
      await prisma.license.create({ data: { licenseKey: row.license_key || row.licensekey || row.key || '', serialNumber: row.serial_number, location: row.location, purchaseDate: row.purchase_date ? new Date(row.purchase_date) : null, expiryDate: row.expiry_date ? new Date(row.expiry_date) : null, status: 'ACTIVE' } })
      imported++
    } catch {}
  }
  return NextResponse.json({ imported, total: rows.length })
}
