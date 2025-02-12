import { FastifyInstance } from 'fastify'
import prisma from '../prisma'
import { normalizeWalletTransaction } from '../normalize'

async function routes(fastify: FastifyInstance) {
  fastify.get('/transactions/wallets', async (request, reply) => {
    try {
      const user_id = request.headers['x-user-id'] as string

      const transactions = await prisma.wallet_transactions.findMany({
        where: { user_id: parseInt(user_id) }
      })

      const formattedTransactions = transactions.map(normalizeWalletTransaction)

      return reply.send({ success: true, data: formattedTransactions })
    } catch (error) {
      return reply
        .status(500)
        .send({ success: false, data: null, message: 'Error fetching wallet transactions' })
    }
  })
}

export default routes
