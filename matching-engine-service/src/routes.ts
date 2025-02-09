import { FastifyInstance } from 'fastify'
import redis from './redis'

async function routes(fastify: FastifyInstance) {
  fastify.post<{ Body: { stock: string; price: number; quantity: number; seller: string } }>(
    '/sell',
    async (request, reply) => {
      const { stock, price, quantity, seller } = request.body

      if (!stock || !price || !quantity || !seller) {
        return reply.status(400).send({ error: 'Missing required fields' })
      }

      const order = { stock, price, quantity, seller, timestamp: Date.now() }

      // Store order in Redis ZSET (price as the score)
      await redis.zadd(stock, price, JSON.stringify(order))

      return reply.send({ message: 'Sell order placed', order })
    }
  )

  // TODO: Handle partial order
  fastify.post<{ Body: { stock: string } }>('/buy', async (request, reply) => {
    const { stock } = request.body

    if (!stock) {
      return reply.status(400).send({ error: 'Stock is required' })
    }

    // Get the cheapest order from the ZSET
    const orders = await redis.zrange(stock, 0, 0)

    if (!orders || orders.length === 0) {
      return reply.status(404).send({ error: 'No sell orders available for this stock' })
    }

    const order = JSON.parse(orders[0])

    await redis.zrem(stock, orders[0])

    return reply.send({ message: 'Buy order matched', order })
  })
}

export default routes
