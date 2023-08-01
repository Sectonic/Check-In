import { PrismaClient } from '@prisma/client'

let db

if (process.env.LOCALE === 'production') {
  db = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  db = global.prisma
}

export default db