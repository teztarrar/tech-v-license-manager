import nodemailer from 'nodemailer'
import prisma from './prisma'

async function getSmtpConfig() {
  const settings = await prisma.setting.findMany()

  const m = Object.fromEntries(settings.map(s => [s.key, s.value]))

  // ✅ SUPPORT BOTH camelCase + snake_case
  const host =
    m.smtp_host ||
    m.smtpHost ||
    process.env.SMTP_HOST ||
    'smtp.gmail.com'

  const port = parseInt(
    m.smtp_port ||
    m.smtpPort ||
    process.env.SMTP_PORT ||
    '587'
  )

  const user =
    m.smtp_user ||
    m.smtpUser ||
    process.env.SMTP_USER ||
    ''

  const pass =
    m.smtp_pass ||
    m.smtpPass ||
    process.env.SMTP_PASS ||
    ''

  const from =
    m.smtp_from ||
    m.smtpFrom ||
    process.env.SMTP_FROM ||
    'noreply@techv.app'

  console.log('📧 SMTP CONFIG:', { host, port, user }) // DEBUG

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    from,
  }
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  const cfg = await getSmtpConfig()

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: cfg.auth,
    tls: {
      rejectUnauthorized: false,
    },
  })

  return transporter.sendMail({
    from: cfg.from,
    to,
    subject,
    html,
  })
}

export async function testSmtp(config: {
  host: string
  port: number
  user: string
  pass: string
}) {
  console.log('🧪 TEST SMTP:', config)

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  return transporter.verify()
}