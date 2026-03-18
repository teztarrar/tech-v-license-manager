import { NextResponse } from 'next/server'
export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('techv_token')
  return res
}
