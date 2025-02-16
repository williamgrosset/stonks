import { FastifyInstance } from 'fastify'
import { prisma } from 'prisma-client'

interface CreateStockBody {
  stock_name: string
}

interface AddUserStockBody {
  stock_id: string
  quantity: number
}

async function routes(fastify: FastifyInstance) {
  fastify.post<{ Body: CreateStockBody }>('/stocks', async (request, reply) => {
    try {
      const user_id = request.headers['x-user-id'] as string
      const { stock_name } = request.body

      if (!stock_name) {
        return reply.status(400).send({ success: false, data: { error: 'Missing fields' } })
      }

      const stock = await prisma.stocks.create({
        data: {
          stock_name,
          user_id: parseInt(user_id)
        }
      })

      return reply.status(201).send({ success: true, data: { stock_id: stock.id } })
    } catch (error) {
      return reply.status(500).send({ success: false, data: { error: 'Internal server error' } })
    }
  })

  fastify.post<{ Body: AddUserStockBody }>('/users/stocks', async (request, reply) => {
    try {
      const user_id = request.headers['x-user-id'] as string
      const { stock_id, quantity } = request.body

      if (!stock_id || !quantity) {
        return reply.status(400).send({ success: false, data: { error: 'Missing fields' } })
      }

      const stockIdInt = parseInt(stock_id)
      const userIdInt = parseInt(user_id)

      await prisma.shares.upsert({
        where: {
          stock_id_user_id: {
            stock_id: stockIdInt,
            user_id: userIdInt
          }
        },
        update: {
          quantity: {
            increment: quantity
          }
        },
        create: {
          stock_id: stockIdInt,
          user_id: userIdInt,
          quantity: quantity
        }
      })

      return reply.send({ success: true, data: null })
    } catch (error) {
      return reply.status(500).send({ success: false, data: { error: 'Internal server error' } })
    }
  })
}

export default routes
