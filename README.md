# Tech V License Manager - Complete Setup Guide

## 🛠 Tech Stack

- **Frontend:** Next.js (React framework)  
- **Backend:** Node.js, TypeScript  
- **Authentication:** NextAuth.js with Prisma adapter  
- **Database:** SQLite (via Prisma ORM)  
- **Email:** Nodemailer (SMTP)  
- **File Handling:** XLSX, PapaParse  
- **Security:** bcrypt, jsonwebtoken  
- **Styling:** Tailwind CSS  
- **Other:** ts-node, tsx  

---

This is a full guide to run the **Tech V License Manager** project on **Windows**, **Linux**, or **macOS**. It includes all required dependencies, Prisma fixes, NextAuth setup, and common troubleshooting steps.

---

## Table of Contents

1. Requirements
2. Initial Setup
3. Environment Variables
4. Installing Dependencies
5. Prisma Fixes (v7 → v6)
6. NextAuth Setup
7. Optional Packages
8. Running the Project
9. Seeding the Database
10. Troubleshooting Common Issues

---

## Requirements

- Node.js 18+ (LTS recommended)
- npm 9+ or Yarn 1.22+/pnpm 8+
- Git
- Optional: VS Code for IDE, Postman for API testing

---

## Initial Setup

```bash
git clone <your-repo-url>
cd <project-folder>

rm -rf node_modules package-lock.json .next dev.db

cp .env.example .env
```

Edit `.env.local` with your configuration.

---

## Installing Dependencies

```bash
npm install --legacy-peer-deps
```

or

```bash
yarn install
```

---

## Prisma Fixes (v7 → v6)

```bash
npm install prisma@6.7.0 @prisma/client@6.7.0
npx prisma generate
rm -f dev.db
npx prisma db push
```

---

## NextAuth Setup

```bash
npm install next-auth@4.24.13 @next-auth/prisma-adapter --legacy-peer-deps
npm install nodemailer@^7.0.7
npm install bcrypt jsonwebtoken bcryptjs
```

Restart:

```bash
npm run dev
```

---

## Optional Packages

```bash
npm install papaparse xlsx
```

---

## Running the Project

### Windows

```bash
npm run dev
```

### Linux / macOS

```bash
npm run dev
```

Open: http://localhost:3000

---

## Seeding the Database

```bash
npx ts-node prisma/seed.ts
```

or

```bash
npx tsx prisma/seed.ts
```

Default credentials:

- Email: admin@techv.com  
- Password: admin123  

---

## Troubleshooting

### Prisma not working

```bash
npx prisma generate
```

### Port issue

```bash
npx kill-port 3000
```

### Cache issues

```bash
rm -rf .next node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

---

## Scripts

- npm run dev
- npm run build
- npm run start
- npm run lint
- npm run format
