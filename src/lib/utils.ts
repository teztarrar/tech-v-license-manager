export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ')
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function getDaysUntilExpiry(expiryDate: Date | string | null | undefined): number | null {
  if (!expiryDate) return null
  const diff = new Date(expiryDate).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getLicenseStatus(expiryDate: Date | string | null | undefined, reminderDays = 30): string {
  if (!expiryDate) return 'ACTIVE'
  const days = getDaysUntilExpiry(expiryDate)
  if (days === null) return 'ACTIVE'
  if (days < 0) return 'EXPIRED'
  if (days <= reminderDays) return 'EXPIRING'
  return 'ACTIVE'
}

export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `${seg()}-${seg()}-${seg()}-${seg()}-${seg()}`
}
