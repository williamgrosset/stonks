import { FastifyInstance } from 'fastify'
import { prisma } from 'prisma-client'

interface DepositMoneyBody {
  amount: number
}

async function routes(fastify: FastifyInstance) {
  fastify.post<{ Body: DepositMoneyBody }>('/wallet/deposit', async (request, reply) => {
    try {
      const user_id = request.headers['x-user-id'] as string
      const { amount } = request.body

      if (!amount) {
        return reply.status(400).send({ success: false, data: null, message: 'Missing fields' })
      }

      if (amount <= 0) {
        return reply
          .status(400)
          .send({ success: false, data: null, message: 'Amount must be greater than 0' })
      }

      await prisma.users.update({
        where: { id: parseInt(user_id) },
        data: {
          wallet_balance: {
            increment: amount
          }
        }
      })

      return reply.status(200).send({ success: true, data: null })
    } catch (error) {
      return reply
        .status(500)
        .send({ success: false, data: null, message: 'Internal server error' })
    }
  })

  fastify.get('/wallet', async (request, reply) => {
    try {
      const user_id = request.headers['x-user-id'] as string

      const { wallet_balance } = await prisma.users.findUniqueOrThrow({
        where: { id: parseInt(user_id) },
        select: {
          wallet_balance: true
        }
      })

      return reply.status(200).send({ success: true, data: { balance: wallet_balance } })
    } catch (error) {
      return reply
        .status(500)
        .send({ success: false, data: null, message: 'Internal server error' })
    }
  })
}

export default routes
