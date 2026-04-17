'use client'

/**
 * Settings Page — Tech V License Manager
 *
 * Tabs:
 *   1. Appearance  — theme switcher (Dark / Light / Neon)
 *   2. Notifications — reminder days slider, email toggle, manual check
 *   3. Email / SMTP  — SMTP fields + test connection
 *   4. Backup        — JSON backup download, manual scheduler run
 *   5. Security      — RBAC info, 2FA info (read-only)
 *
 * Every tab has:
 *   • Framer Motion transition
 *   • Proper form state driven from API
 *   • Save button with loading + success feedback
 */

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button, Input, Card, PageSpinner } from '@/components/ui'
import { useTheme, type Theme } from '@/components/ThemeProvider'
import {
  Palette, Mail, Bell, Database, Shield,
  Save, FlaskConical,
  Sun, Moon, Zap,
  Download, RefreshCw,
  CheckCircle, AlertCircle, Check,
  Lock, Users, KeyRound,
} from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────────── */
interface AppSettings {
  theme: string
  reminderDays: string
  emailNotifications: string
  smtpHost: string
  smtpPort: string
  smtpUser: string
  smtpPass: string
  smtpFrom: string
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  reminderDays: '30',
  emailNotifications: 'false',
  smtpHost: '',
  smtpPort: '587',
  smtpUser: '',
  smtpPass: '',
  smtpFrom: '',
}

/* ─── Tab config ─────────────────────────────────────────────── */
const TABS = [
  { id: 'appearance',    label: 'Appearance',   icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell    },
  { id: 'smtp',          label: 'Email / SMTP',  icon: Mail    },
  { id: 'backup',        label: 'Backup',        icon: Database },
  { id: 'security',      label: 'Security',      icon: Shield  },
] as const

type TabId = typeof TABS[number]['id']

<<<<<<< HEAD
/* ─── Key mapping utilities ──────────────────────────────────── */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, l) => l.toUpperCase())
}

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`)
}

function convertSettingsKeys(obj: Record<string, any>, converter: (s: string) => string): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (key !== 'testEmail') result[converter(key)] = value
  }
  return result
}

=======
>>>>>>> 3469a1f8813ccd2283d1aa59e9f820c5454a3eaa
/* ─── Framer variants ────────────────────────────────────────── */
const tabVariants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.15 } },
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════ */
export default function SettingsPage() {
  const { theme: activeTheme, setTheme } = useTheme()

  const [activeTab, setActiveTab] = useState<TabId>('appearance')
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveOk, setSaveOk] = useState(false)

  // SMTP test state
  const [testEmail, setTestEmail] = useState('')
  const [smtpTesting, setSmtpTesting] = useState(false)
  const [smtpResult, setSmtpResult] = useState<{ ok: boolean; msg: string } | null>(null)

  // Backup / scheduler state
  const [backupLoading, setBackupLoading] = useState(false)
  const [checkLoading, setCheckLoading]   = useState(false)
  const [checkMsg, setCheckMsg] = useState('')

  /* ── Fetch settings on mount ─────────────────────────────── */
  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
<<<<<<< HEAD
        const camelData = Object.fromEntries(
          Object.entries(data).map(([k, v]) => [snakeToCamel(k), v])
        )
        setSettings(s => ({ ...s, ...camelData }))
=======
        setSettings(s => ({ ...s, ...data }))
>>>>>>> 3469a1f8813ccd2283d1aa59e9f820c5454a3eaa
      }
    } catch (err) {
      console.error('Failed to load settings', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadSettings() }, [loadSettings])

  /* ── Save settings ───────────────────────────────────────── */
  async function handleSave() {
    setSaving(true)
    setSaveOk(false)
    try {
<<<<<<< HEAD
      const snakeSettings = convertSettingsKeys(settings, camelToSnake)
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snakeSettings),
=======
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
>>>>>>> 3469a1f8813ccd2283d1aa59e9f820c5454a3eaa
      })
      // Apply theme immediately after save
      if (settings.theme) setTheme(settings.theme as Theme)
      setSaveOk(true)
      setTimeout(() => setSaveOk(false), 3500)
    } catch (err) {
      console.error('Save failed', err)
    } finally {
      setSaving(false)
    }
  }

  /* ── Helper to update a single setting field ─────────────── */
  function setSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  /* ── SMTP test ───────────────────────────────────────────── */
  async function handleSmtpTest() {
    setSmtpTesting(true)
    setSmtpResult(null)
    try {
<<<<<<< HEAD
      const snakeSettings = convertSettingsKeys(settings, camelToSnake)
      const payload = { ...snakeSettings, testEmail }
      const res = await fetch('/api/settings/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
=======
      const res = await fetch('/api/settings/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, testEmail }),
>>>>>>> 3469a1f8813ccd2283d1aa59e9f820c5454a3eaa
      })
      const data = await res.json()
      setSmtpResult(res.ok
        ? { ok: true,  msg: data.message || 'Test email sent successfully!' }
        : { ok: false, msg: data.error   || 'SMTP test failed.' }
      )
    } catch (err: any) {
      setSmtpResult({ ok: false, msg: err.message || 'Network error.' })
    } finally {
      setSmtpTesting(false)
    }
  }

  /* ── Backup download ─────────────────────────────────────── */
  async function handleBackupDownload() {
    setBackupLoading(true)
    try {
      const res = await fetch('/api/backup')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `techv-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Backup failed', err)
    } finally {
      setBackupLoading(false)
    }
  }

  /* ── Manual license check ────────────────────────────────── */
  async function handleLicenseCheck() {
    setCheckLoading(true)
    setCheckMsg('')
    try {
      await fetch('/api/scheduler', { method: 'POST' })
      setCheckMsg('✅ License check complete — notifications updated.')
    } catch {
      setCheckMsg('❌ Check failed. Please try again.')
    } finally {
      setCheckLoading(false)
      setTimeout(() => setCheckMsg(''), 5000)
    }
  }

  /* ── Theme switch (also updates settings state) ──────────── */
  function handleThemeSelect(t: Theme) {
    setTheme(t)
    setSetting('theme', t)
  }

  /* ════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════ */
  return (
    <DashboardLayout title="Settings">
      <div className="flex flex-col lg:flex-row gap-5">

        {/* ── Sidebar nav ───────────────────────────────────── */}
        <aside className="lg:w-56 flex-shrink-0">
          <Card className="p-2 overflow-hidden">
            <nav className="space-y-0.5">
              {TABS.map(tab => {
                const isActive = activeTab === tab.id
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileTap={{ scale: 0.97 }}
                    className={[
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                      'text-sm font-medium transition-all duration-150 select-none',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                      isActive
                        ? 'bg-[var(--brand-600)] text-white shadow-sm'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
                    ].join(' ')}
                  >
                    <tab.icon size={15} className="flex-shrink-0" />
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60"
                      />
                    )}
                  </motion.button>
                )
              })}
            </nav>
          </Card>
        </aside>

        {/* ── Main content ──────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <PageSpinner />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                {/* ══ APPEARANCE ══════════════════════════════ */}
                {activeTab === 'appearance' && (
                  <AppearanceTab
                    currentTheme={(settings.theme as Theme) || activeTheme}
                    onThemeSelect={handleThemeSelect}
                    onSave={handleSave}
                    saving={saving}
                    saveOk={saveOk}
                  />
                )}

                {/* ══ NOTIFICATIONS ═══════════════════════════ */}
                {activeTab === 'notifications' && (
                  <NotificationsTab
                    reminderDays={settings.reminderDays}
                    emailNotifications={settings.emailNotifications}
                    onReminderChange={v => setSetting('reminderDays', v)}
                    onEmailToggle={() =>
                      setSetting('emailNotifications',
                        settings.emailNotifications === 'true' ? 'false' : 'true'
                      )
                    }
                    onSave={handleSave}
                    saving={saving}
                    saveOk={saveOk}
                    checkLoading={checkLoading}
                    checkMsg={checkMsg}
                    onRunCheck={handleLicenseCheck}
                  />
                )}

                {/* ══ SMTP ════════════════════════════════════ */}
                {activeTab === 'smtp' && (
                  <SmtpTab
                    settings={settings}
                    onChange={setSetting}
                    testEmail={testEmail}
                    onTestEmailChange={setTestEmail}
                    onTest={handleSmtpTest}
                    testLoading={smtpTesting}
                    testResult={smtpResult}
                    onSave={handleSave}
                    saving={saving}
                    saveOk={saveOk}
                  />
                )}

                {/* ══ BACKUP ══════════════════════════════════ */}
                {activeTab === 'backup' && (
                  <BackupTab
                    backupLoading={backupLoading}
                    checkLoading={checkLoading}
                    checkMsg={checkMsg}
                    onDownload={handleBackupDownload}
                    onRunCheck={handleLicenseCheck}
                  />
                )}

                {/* ══ SECURITY ════════════════════════════════ */}
                {activeTab === 'security' && <SecurityTab />}

                {/* ── Global save feedback banner ─────────── */}
                <AnimatePresence>
                  {saveOk && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl
                                 bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
                    >
                      <CheckCircle size={15} />
                      Settings saved successfully!
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

/* ════════════════════════════════════════════════════════════════
   SUB-COMPONENTS (one per tab — keeps the main component clean)
════════════════════════════════════════════════════════════════ */

/* ── Appearance ─────────────────────────────────────────────── */
interface AppearanceProps {
  currentTheme: Theme
  onThemeSelect: (t: Theme) => void
  onSave: () => void
  saving: boolean
  saveOk: boolean
}

const THEME_OPTIONS: { id: Theme; label: string; desc: string; icon: typeof Sun; previewBg: string; iconColor: string }[] = [
  {
    id: 'dark',
    label: 'Dark',
    desc: 'Deep slate • indigo',
    icon: Moon,
    previewBg: 'bg-gray-900',
    iconColor: 'text-gray-300',
  },
  {
    id: 'light',
    label: 'Light',
    desc: 'Clean • minimal',
    icon: Sun,
    previewBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
  },
  {
    id: 'neon',
    label: 'Neon',
    desc: 'Cyberpunk • glow',
    icon: Zap,
    previewBg: 'bg-[#04050e] border border-[#00ffaa]/20',
    iconColor: 'text-[#00ffaa]',
  },
]

function AppearanceTab({ currentTheme, onThemeSelect, onSave, saving }: AppearanceProps) {
  return (
    <Card title="Theme & Appearance">
      <div className="p-6 space-y-6">
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)] mb-1">Color Theme</p>
          <p className="text-xs text-[var(--text-secondary)] mb-5">
            Choose how Tech V looks across all pages. Changes apply instantly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {THEME_OPTIONS.map(opt => {
              const isSelected = currentTheme === opt.id
              return (
                <motion.button
                  key={opt.id}
                  onClick={() => onThemeSelect(opt.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={[
                    'relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                    isSelected
                      ? 'border-[var(--brand-500)] bg-[var(--brand-500)]/10 shadow-lg'
                      : 'border-[var(--border-subtle)] hover:border-[var(--border-medium)] bg-[var(--bg-input)]',
                  ].join(' ')}
                >
                  {/* Checkmark badge */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full
                                 bg-[var(--brand-500)] flex items-center justify-center"
                    >
                      <Check size={11} className="text-white" strokeWidth={3} />
                    </motion.div>
                  )}

                  {/* Theme preview circle */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${opt.previewBg}`}>
                    <opt.icon size={22} className={opt.iconColor} />
                  </div>

                  <div className="text-center">
                    <p className={`text-sm font-semibold ${isSelected ? 'text-[var(--brand-500)]' : 'text-[var(--text-primary)]'}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{opt.desc}</p>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Live preview strip */}
        <div className="rounded-xl overflow-hidden border border-[var(--border-subtle)]">
          <div className="px-4 py-2 bg-[var(--bg-sidebar)] border-b border-[var(--border-subtle)] flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="text-[10px] text-[var(--text-muted)] ml-2 font-mono">live preview</span>
          </div>
          <div className="p-4 bg-[var(--bg-card)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-600)] flex items-center justify-center">
              <Palette size={14} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">Tech V License Manager</p>
              <p className="text-[10px] text-[var(--text-secondary)]">Theme preview — {currentTheme} mode active</p>
            </div>
            <div className="ml-auto flex gap-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold
                               bg-[var(--status-active-bg)] text-[var(--status-active-text)]
                               border border-[var(--status-active-border)]">ACTIVE</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold
                               bg-[var(--status-expiring-bg)] text-[var(--status-expiring-text)]
                               border border-[var(--status-expiring-border)]">EXPIRING</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button onClick={onSave} loading={saving} icon={<Save size={14} />}>
            Save Appearance
          </Button>
        </div>
      </div>
    </Card>
  )
}

/* ── Notifications ──────────────────────────────────────────── */
interface NotificationsProps {
  reminderDays: string
  emailNotifications: string
  onReminderChange: (v: string) => void
  onEmailToggle: () => void
  onSave: () => void
  saving: boolean
  saveOk: boolean
  checkLoading: boolean
  checkMsg: string
  onRunCheck: () => void
}

function NotificationsTab({
  reminderDays, emailNotifications,
  onReminderChange, onEmailToggle,
  onSave, saving,
  checkLoading, checkMsg, onRunCheck,
}: NotificationsProps) {
  const days = parseInt(reminderDays) || 30
  const urgencyColor = days <= 14 ? 'text-red-400' : days <= 30 ? 'text-yellow-400' : 'text-green-400'

  return (
    <Card title="Notification Settings">
      <div className="p-6 space-y-6">

        {/* Reminder slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-[var(--text-primary)]">Expiry Reminder Threshold</p>
            <span className={`text-xl font-bold tabular-nums ${urgencyColor}`}>{days}d</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mb-4">
            Send alerts when licenses will expire within this many days.
          </p>
          <input
            type="range" min="7" max="90" step="1"
            value={days}
            onChange={e => onReminderChange(e.target.value)}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-indigo-500
                       bg-[var(--bg-input)]"
          />
          <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1.5">
            <span>7 days</span>
            <span>30 days</span>
            <span>60 days</span>
            <span>90 days</span>
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-5">
          {/* Email notifications toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl
                          bg-[var(--bg-input)] border border-[var(--border-subtle)]">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Email Notifications</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Send automatic email alerts for expiring and expired licenses
              </p>
            </div>
            {/* Toggle switch */}
            <button
              onClick={onEmailToggle}
              role="switch"
              aria-checked={emailNotifications === 'true'}
              className={[
                'relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none',
                'focus-visible:ring-2 focus-visible:ring-indigo-500 flex-shrink-0',
                emailNotifications === 'true' ? 'bg-[var(--brand-500)]' : 'bg-gray-600',
              ].join(' ')}
            >
              <motion.span
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                style={{ left: emailNotifications === 'true' ? '22px' : '2px' }}
              />
            </button>
          </div>
        </div>

        {/* Manual check */}
        <div className="border-t border-[var(--border-subtle)] pt-5 space-y-3">
          <p className="text-sm font-medium text-[var(--text-primary)]">Manual License Check</p>
          <p className="text-xs text-[var(--text-secondary)]">
            Force-run the license status checker right now — updates ACTIVE / EXPIRING / EXPIRED statuses
            and creates notifications.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="secondary"
              onClick={onRunCheck}
              loading={checkLoading}
              icon={<RefreshCw size={13} />}
            >
              Run Check Now
            </Button>
            <AnimatePresence>
              {checkMsg && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-green-400"
                >
                  {checkMsg}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[var(--border-subtle)]">
          <Button onClick={onSave} loading={saving} icon={<Save size={14} />}>
            Save Notifications
          </Button>
        </div>
      </div>
    </Card>
  )
}

/* ── SMTP ────────────────────────────────────────────────────── */
interface SmtpProps {
  settings: AppSettings
  onChange: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
  testEmail: string
  onTestEmailChange: (v: string) => void
  onTest: () => void
  testLoading: boolean
  testResult: { ok: boolean; msg: string } | null
  onSave: () => void
  saving: boolean
  saveOk: boolean
}

function SmtpTab({ settings, onChange, testEmail, onTestEmailChange, onTest, testLoading, testResult, onSave, saving }: SmtpProps) {
  return (
    <Card title="Email / SMTP Configuration">
      <div className="p-6 space-y-5">
        <p className="text-xs text-[var(--text-secondary)]">
          Configure an SMTP server to enable automatic license expiry email alerts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="SMTP Host"
              value={settings.smtpHost}
              onChange={v => onChange('smtpHost', v)}
              placeholder="smtp.gmail.com"
            />
          </div>
          <Input label="Port"         value={settings.smtpPort} onChange={v => onChange('smtpPort', v)} placeholder="587" />
          <Input label="From Address" value={settings.smtpFrom} onChange={v => onChange('smtpFrom', v)} placeholder="noreply@yourcompany.com" />
          <Input label="Username"     value={settings.smtpUser} onChange={v => onChange('smtpUser', v)} placeholder="your@email.com" />
          <Input label="Password"     value={settings.smtpPass} onChange={v => onChange('smtpPass', v)} type="password" placeholder="••••••••" />
        </div>

        {/* Test section */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] p-4 space-y-3">
          <p className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
            <FlaskConical size={14} className="text-[var(--text-secondary)]" />
            Test Connection
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Send a test email to verify your SMTP settings are correct.
          </p>
          <div className="flex gap-2 flex-wrap">
            <input
              value={testEmail}
              onChange={e => onTestEmailChange(e.target.value)}
              placeholder="Recipient email (optional)"
              className={[
                'flex-1 min-w-48 px-3 py-2.5 rounded-lg text-sm',
                'bg-[var(--bg-card)] border border-[var(--border-medium)]',
                'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/40',
                'transition-all',
              ].join(' ')}
            />
            <Button
              variant="secondary"
              onClick={onTest}
              loading={testLoading}
              icon={<FlaskConical size={13} />}
            >
              {testLoading ? 'Testing…' : 'Send Test'}
            </Button>
          </div>

          <AnimatePresence>
            {testResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={[
                  'flex items-start gap-2.5 p-3 rounded-lg text-sm',
                  testResult.ok
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400',
                ].join(' ')}
              >
                {testResult.ok
                  ? <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                  : <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                }
                <span>{testResult.msg}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-end border-t border-[var(--border-subtle)] pt-4">
          <Button onClick={onSave} loading={saving} icon={<Save size={14} />}>
            Save SMTP Settings
          </Button>
        </div>
      </div>
    </Card>
  )
}

/* ── Backup ─────────────────────────────────────────────────── */
interface BackupProps {
  backupLoading: boolean
  checkLoading: boolean
  checkMsg: string
  onDownload: () => void
  onRunCheck: () => void
}

function BackupTab({ backupLoading, checkLoading, checkMsg, onDownload, onRunCheck }: BackupProps) {
  return (
    <Card title="Backup & Data Management">
      <div className="p-6 space-y-5">
        <p className="text-sm text-[var(--text-secondary)]">
          Export your data for safekeeping or migration. The scheduler runs automatic checks daily at 08:00.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* JSON Backup card */}
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <Download size={16} className="text-indigo-400" />
              </div>
              <span className="font-medium text-sm text-[var(--text-primary)]">JSON Backup</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] flex-1">
              Full export of all licenses, companies, products, and notifications as a JSON file.
            </p>
            <Button
              variant="secondary"
              onClick={onDownload}
              loading={backupLoading}
              icon={<Download size={13} />}
              className="w-full justify-center"
            >
              {backupLoading ? 'Preparing…' : 'Download Backup'}
            </Button>
          </div>

          {/* Manual check card */}
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <RefreshCw size={16} className="text-green-400" />
              </div>
              <span className="font-medium text-sm text-[var(--text-primary)]">License Check</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] flex-1">
              Manually trigger the license status updater — marks expired licenses and creates notifications.
            </p>
            <Button
              variant="secondary"
              onClick={onRunCheck}
              loading={checkLoading}
              icon={<RefreshCw size={13} />}
              className="w-full justify-center"
            >
              {checkLoading ? 'Running…' : 'Run Check Now'}
            </Button>
          </div>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {checkMsg && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl
                         bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
            >
              <CheckCircle size={14} />
              {checkMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info tip */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/15">
          <span className="text-base mt-0.5">💡</span>
          <p className="text-xs text-yellow-300/80 leading-relaxed">
            <strong className="text-yellow-300">Tip:</strong> Store your JSON backups in a secure location such as
            cloud storage or an encrypted drive. Backups include all license keys — treat them as sensitive data.
          </p>
        </div>
      </div>
    </Card>
  )
}

/* ── Security ────────────────────────────────────────────────── */
function SecurityTab() {
  const roles = [
    {
      role: 'Admin',
      desc: 'Full access — manage settings, users, licenses, and all data',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      role: 'Manager',
      desc: 'Can create and edit licenses, companies, and products',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      role: 'Viewer',
      desc: 'Read-only access to all records — cannot modify data',
      color: 'text-slate-400',
      bg: 'bg-slate-500/10 border-slate-500/20',
    },
  ]

  return (
    <div className="space-y-4">
      {/* 2FA card */}
      <Card title="Two-Factor Authentication">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0">
              <KeyRound size={18} className="text-indigo-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                Authenticator App (TOTP)
              </p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Two-factor authentication via TOTP (Google Authenticator, Authy, etc.) is supported.
                When enabled on your account, you will be prompted for a 6-digit code at login.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                              bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                <Lock size={12} className="text-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-secondary)]">Configurable per user account</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* RBAC card */}
      <Card title="Role-Based Access Control">
        <div className="p-6 space-y-3">
          <p className="text-xs text-[var(--text-secondary)] mb-4">
            Access in Tech V is governed by three roles. Assign roles when creating or editing users.
          </p>
          {roles.map(r => (
            <motion.div
              key={r.role}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-start gap-3 p-3.5 rounded-xl border ${r.bg}`}
            >
              <span className={`text-xs px-2.5 py-1 rounded-lg font-bold border ${r.bg} ${r.color} flex-shrink-0 mt-0.5`}>
                {r.role}
              </span>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
          <div className="pt-2 flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Users size={12} />
            <span>Manage users and assign roles in the <strong className="text-[var(--text-secondary)]">Users</strong> page.</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
