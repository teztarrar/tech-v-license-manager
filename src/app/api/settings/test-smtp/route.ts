import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import nodemailer from 'nodemailer'
import prisma from '@/lib/prisma'

async function getSmtpConfig() {
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from']
      }
    }
  })

  const m = Object.fromEntries(settings.map(s => [s.key, s.value]))

  return {
    host: m.smtp_host || 'smtp.gmail.com',
    port: parseInt(m.smtp_port || '587'),
    user: m.smtp_user || '',
    pass: m.smtp_pass || '',
    from: m.smtp_from || m.smtp_user || 'noreply@test.com'
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { to } = await req.json()

    if (!to) {
      return NextResponse.json({ error: 'Recipient email required' }, { status: 400 })
    }

    const cfg = await getSmtpConfig()

    const transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.port === 465,
      auth: {
        user: cfg.user,
        pass: cfg.pass
      }
    })

    // verify connection first
    await transporter.verify()

    // send actual email
    await transporter.sendMail({
      from: cfg.from,
      to,
      subject: '✅ Tech V SMTP Test Successful',
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>SMTP Working 🎉</h2>
          <p>Your SMTP configuration is correct.</p>
          <p>You can now send license expiry emails.</p>
        </div>
      `
    })

    return NextResponse.json({
      ok: true,
      message: 'Test email sent successfully!'
    })

  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      error: e.message || 'SMTP failed'
    }, { status: 400 })
  }
}