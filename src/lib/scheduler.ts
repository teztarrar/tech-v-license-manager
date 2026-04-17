import cron from 'node-cron'
import prisma from './prisma'
import { sendEmail } from './mailer'

export function startScheduler() {
  cron.schedule('0 8 * * *', async () => {
    console.log('[Scheduler] Checking expiring licenses...')
    const reminderDaysSetting = await prisma.setting.findUnique({ where: { key: 'reminder_days' } })
    const days = parseInt(reminderDaysSetting?.value || '30')
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() + days)
    const licenses = await prisma.license.findMany({
      where: { expiryDate: { lte: cutoff, gte: new Date() }, status: { in: ['ACTIVE','EXPIRING'] } },
      include: { company: true, product: true }
    })
    for (const lic of licenses) {
      const daysLeft = Math.ceil((new Date(lic.expiryDate!).getTime() - Date.now()) / 86400000)
      await prisma.notification.create({ data: { type: 'EXPIRING', message: `License ${lic.licenseKey} (${lic.product?.name}) for ${lic.company?.name} expires in ${daysLeft} days.`, licenseId: lic.id } })
      if (lic.company?.email) {
        await sendEmail(lic.company.email, `License Expiry Reminder — ${lic.licenseKey}`,
          `<h2>License Expiry Alert</h2><p>Your license <b>${lic.licenseKey}</b> for <b>${lic.product?.name}</b> expires in <b>${daysLeft} days</b>.</p><p>Please renew promptly.</p><br><small>— Tech V License Hub</small>`
        ).catch(console.error)
      }
      await prisma.license.update({ where: { id: lic.id }, data: { status: 'EXPIRING' } })
    }
    // Mark expired
    await prisma.license.updateMany({ where: { expiryDate: { lt: new Date() } }, data: { status: 'EXPIRED' } })
    console.log(`[Scheduler] Processed ${licenses.length} expiring licenses.`)
  })
}
