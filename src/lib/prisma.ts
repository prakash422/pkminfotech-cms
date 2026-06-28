import { PrismaClient } from '@prisma/client'

if (!process.env.DATABASE_URL) {
  // Set a dummy URL locally to prevent Prisma Client initialization crash when DATABASE_URL is missing
  process.env.DATABASE_URL = "mongodb://localhost:27017/pkminfotech?connectTimeoutMS=1000"
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 