import { FastifyInstance } from 'fastify'
import prisma from '../prisma.js'
import { normalizeWalletTransaction } from '../normalize.js'

async function routes(fastify: FastifyInstance) {
  fastify.get('/transactions/wallets', async (request, reply) => {
    try {
      const user_id = request.headers['x-user-id'] as string

      const transactions = await prisma.wallet_transactions.findMany({
        where: { user_id: parseInt(user_id) },
        include: {
          stock_transaction: {
            select: {
              id: true
            }
          }
        },
        orderBy: {
          time_stamp: 'asc'
        }
      })

      const formattedTransactions = transactions.map(normalizeWalletTransaction)

      return reply.send({ success: true, data: formattedTransactions })
    } catch (error) {
      return reply
        .status(500)
        .send({ success: false, data: { error: 'Error fetching wallet transactions' } })
    }
  })
}

export default routes
