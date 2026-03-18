import { NextResponse } from 'next/server'

let initialized = false

export async function GET() {
  if (!initialized) {
    initialized = true
    try {
      const { startScheduler } = await import('@/lib/scheduler')
      startScheduler()
    } catch (e) {
      console.error('Scheduler init error:', e)
    }
  }
  return NextResponse.json({ ok: true, initialized })
}
