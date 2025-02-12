import { FastifyInstance } from 'fastify'
import prisma from '../prisma'
import { normalizeStockTransaction } from '../normalize'

async function routes(fastify: FastifyInstance) {
  fastify.get('/stocks', async (request, reply) => {
    try {
      const user_id = request.headers['x-user-id'] as string

      const transactions = await prisma.stock_transactions.findMany({
        where: { user_id: parseInt(user_id) }
      })

      const formattedTransactions = transactions.map(normalizeStockTransaction)

      return reply.send({ success: true, data: formattedTransactions })
    } catch (error) {
      return reply
        .status(500)
        .send({ success: false, data: null, message: 'Error fetching stock transactions' })
    }
  })
}

export default routes
