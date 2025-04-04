import { Prisma, PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

// Ensure a single Prisma client instance per service
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL }
    }
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export type User<T extends Prisma.usersInclude = {}> = Prisma.usersGetPayload<{ include: T }>
export type Stock<T extends Prisma.stocksInclude = {}> = Prisma.stocksGetPayload<{ include: T }>
export type Share<T extends Prisma.sharesInclude = {}> = Prisma.sharesGetPayload<{ include: T }>
export type StockTransaction<T extends Prisma.stock_transactionsInclude = {}> =
  Prisma.stock_transactionsGetPayload<{ include: T }>
export type WalletTransaction<T extends Prisma.wallet_transactionsInclude = {}> =
  Prisma.wallet_transactionsGetPayload<{ include: T }>
