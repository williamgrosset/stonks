"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const globalForPrisma = global;
// Ensure a single Prisma client instance per service
exports.prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        datasources: {
            db: { url: process.env.DATABASE_URL }
        }
    });
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
