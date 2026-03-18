export type LicenseStatus = 'ACTIVE' | 'EXPIRING' | 'EXPIRED'
export type UserRole = 'ADMIN' | 'MANAGER' | 'VIEWER'
export type Theme = 'dark' | 'light' | 'neon'

export interface License {
  id: string
  licenseKey: string
  serialNumber?: string | null
  status: LicenseStatus
  location?: string | null
  purchaseDate?: Date | null
  expiryDate?: Date | null
  notes?: string | null
  companyId?: string | null
  productId?: string | null
  company?: Company | null
  product?: Product | null
  createdAt: Date
  updatedAt: Date
}

export interface Company {
  id: string
  name: string
  location?: string | null
  contactPerson?: string | null
  email?: string | null
  phone?: string | null
  createdAt: Date
  updatedAt: Date
  _count?: { licenses: number }
}

export interface Product {
  id: string
  name: string
  vendor?: string | null
  licenseType?: string | null
  renewalCycle?: string | null
  price?: number | null
  createdAt: Date
  updatedAt: Date
  _count?: { licenses: number }
}

export interface Notification {
  id: string
  type: string
  message: string
  read: boolean
  licenseId?: string | null
  createdAt: Date
}
