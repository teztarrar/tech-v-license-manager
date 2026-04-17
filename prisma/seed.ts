const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Workspace
  const workspace = await prisma.workspace.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default', name: 'Tech V Default Workspace' },
  })

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@techv.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@techv.com',
      password: hashedPassword,
      role: 'ADMIN',
      workspaceId: workspace.id,
    },
  })

  // Manager user
  const managerPass = await bcrypt.hash('manager123', 12)
  await prisma.user.upsert({
    where: { email: 'manager@techv.com' },
    update: {},
    create: {
      name: 'Jane Manager',
      email: 'manager@techv.com',
      password: managerPass,
      role: 'MANAGER',
      workspaceId: workspace.id,
    },
  })

  // Companies
  const companies = await Promise.all([
    prisma.company.upsert({
      where: { id: 'c1' }, update: {},
      create: { id: 'c1', name: 'Acme Corporation', location: 'New York, USA', contactPerson: 'John Smith', email: 'john@acme.com', phone: '+1-555-0100', workspaceId: workspace.id },
    }),
    prisma.company.upsert({
      where: { id: 'c2' }, update: {},
      create: { id: 'c2', name: 'TechStart Inc', location: 'San Francisco, USA', contactPerson: 'Jane Doe', email: 'jane@techstart.com', phone: '+1-555-0200', workspaceId: workspace.id },
    }),
    prisma.company.upsert({
      where: { id: 'c3' }, update: {},
      create: { id: 'c3', name: 'Global Systems Ltd', location: 'London, UK', contactPerson: 'Robert Wilson', email: 'robert@globalsystems.com', phone: '+44-20-5555-0300', workspaceId: workspace.id },
    }),
    prisma.company.upsert({
      where: { id: 'c4' }, update: {},
      create: { id: 'c4', name: 'DataCorp Solutions', location: 'Berlin, Germany', contactPerson: 'Hans Müller', email: 'hans@datacorp.de', phone: '+49-30-5555-0400', workspaceId: workspace.id },
    }),
  ])

  // Products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'p1' }, update: {},
      create: { id: 'p1', name: 'Enterprise Suite Pro', vendor: 'Microsoft', licenseType: 'Perpetual', renewalCycle: 'Annual', price: 2999.99, workspaceId: workspace.id },
    }),
    prisma.product.upsert({
      where: { id: 'p2' }, update: {},
      create: { id: 'p2', name: 'Security Shield Ultimate', vendor: 'Symantec', licenseType: 'Subscription', renewalCycle: 'Annual', price: 1499.99, workspaceId: workspace.id },
    }),
    prisma.product.upsert({
      where: { id: 'p3' }, update: {},
      create: { id: 'p3', name: 'Database Manager Pro', vendor: 'Oracle', licenseType: 'Subscription', renewalCycle: 'Annual', price: 4999.99, workspaceId: workspace.id },
    }),
    prisma.product.upsert({
      where: { id: 'p4' }, update: {},
      create: { id: 'p4', name: 'Design Studio', vendor: 'Adobe', licenseType: 'Subscription', renewalCycle: 'Monthly', price: 599.99, workspaceId: workspace.id },
    }),
    prisma.product.upsert({
      where: { id: 'p5' }, update: {},
      create: { id: 'p5', name: 'Cloud Infrastructure', vendor: 'AWS', licenseType: 'Subscription', renewalCycle: 'Monthly', price: 8500.00, workspaceId: workspace.id },
    }),
  ])

  // Licenses — spread across statuses
  const now = new Date()
  const addDays = (n: number) => new Date(now.getTime() + n * 86400000)

  const licenses = [
    { id: 'l1', licenseKey: 'AAAA-BBBB-CCCC-DDDD-1111', serialNumber: 'SN-001-2024', status: 'ACTIVE',   location: 'HQ Server Room',    purchaseDate: new Date('2024-01-15'), expiryDate: addDays(365),  companyId: 'c1', productId: 'p1' },
    { id: 'l2', licenseKey: 'EEEE-FFFF-GGGG-HHHH-2222', serialNumber: 'SN-002-2024', status: 'EXPIRING', location: 'Branch Office',      purchaseDate: new Date('2024-03-01'), expiryDate: addDays(20),   companyId: 'c2', productId: 'p2' },
    { id: 'l3', licenseKey: 'IIII-JJJJ-KKKK-LLLL-3333', serialNumber: 'SN-003-2024', status: 'EXPIRED',  location: 'Data Center',        purchaseDate: new Date('2023-06-01'), expiryDate: addDays(-30),  companyId: 'c3', productId: 'p3' },
    { id: 'l4', licenseKey: 'MMMM-NNNN-OOOO-PPPP-4444', serialNumber: 'SN-004-2024', status: 'ACTIVE',   location: 'Remote Workers',     purchaseDate: new Date('2024-08-01'), expiryDate: addDays(450),  companyId: 'c1', productId: 'p4' },
    { id: 'l5', licenseKey: 'QQQQ-RRRR-SSSS-TTTT-5555', serialNumber: 'SN-005-2024', status: 'EXPIRING', location: 'Marketing Dept',     purchaseDate: new Date('2024-02-10'), expiryDate: addDays(10),   companyId: 'c2', productId: 'p1' },
    { id: 'l6', licenseKey: 'UUUU-VVVV-WWWW-XXXX-6666', serialNumber: 'SN-006-2024', status: 'ACTIVE',   location: 'Finance Dept',       purchaseDate: new Date('2024-05-15'), expiryDate: addDays(280),  companyId: 'c3', productId: 'p5' },
    { id: 'l7', licenseKey: 'YYYY-ZZZZ-1111-2222-7777', serialNumber: 'SN-007-2024', status: 'ACTIVE',   location: 'Dev Environment',    purchaseDate: new Date('2024-07-01'), expiryDate: addDays(200),  companyId: 'c4', productId: 'p2' },
    { id: 'l8', licenseKey: 'AAAB-BBBBC-CCCD-DDDE-8888', serialNumber: 'SN-008-2024', status: 'EXPIRED', location: 'Old Workstations',   purchaseDate: new Date('2023-01-01'), expiryDate: addDays(-90),  companyId: 'c1', productId: 'p3' },
    { id: 'l9', licenseKey: 'FFFF-GGGH-HHHI-JJJK-9999', serialNumber: 'SN-009-2024', status: 'EXPIRING',location: 'QA Lab',             purchaseDate: new Date('2024-04-01'), expiryDate: addDays(7),    companyId: 'c4', productId: 'p4' },
    { id: 'l10',licenseKey: 'LLLL-MMMN-NNNO-PPPQ-0000', serialNumber: 'SN-010-2024', status: 'ACTIVE',  location: 'Cloud Infrastructure',purchaseDate: new Date('2024-09-01'), expiryDate: addDays(320), companyId: 'c2', productId: 'p5' },
  ]

  for (const lic of licenses) {
    await prisma.license.upsert({
      where: { id: lic.id },
      update: {},
      create: { ...lic, workspaceId: workspace.id },
    })
  }

  // Notifications
  await prisma.notification.deleteMany({})
  await prisma.notification.createMany({
    data: [
      { type: 'EXPIRING', message: 'License EEEE-FFFF-GGGG-HHHH-2222 expires in 20 days', licenseId: 'l2', read: false },
      { type: 'EXPIRING', message: 'License QQQQ-RRRR-SSSS-TTTT-5555 expires in 10 days', licenseId: 'l5', read: false },
      { type: 'EXPIRING', message: 'License FFFF-GGGH-HHHI-JJJK-9999 expires in 7 days — urgent!', licenseId: 'l9', read: false },
      { type: 'EXPIRED',  message: 'License IIII-JJJJ-KKKK-LLLL-3333 has expired (30 days ago)', licenseId: 'l3', read: true },
      { type: 'EXPIRED',  message: 'License AAAB-BBBBC-CCCD-DDDE-8888 has expired (90 days ago)', licenseId: 'l8', read: true },
    ],
  })

  // Default settings
  const defaultSettings = [
    { key: 'theme',              value: 'dark' },
    { key: 'reminderDays',       value: '30' },
    { key: 'smtpHost',           value: '' },
    { key: 'smtpPort',           value: '587' },
    { key: 'smtpUser',           value: '' },
    { key: 'smtpPass',           value: '' },
    { key: 'smtpFrom',           value: '' },
    { key: 'emailNotifications', value: 'false' },
  ]

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key_workspaceId: { key: s.key, workspaceId: workspace.id } },
      update: {},
      create: { ...s, workspaceId: workspace.id },
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log('👤 Admin:   admin@techv.com   / admin123')
  console.log('👤 Manager: manager@techv.com / manager123')
  console.log(`📦 ${licenses.length} licenses | ${companies.length} companies | ${products.length} products`)
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
