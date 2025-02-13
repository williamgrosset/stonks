import { FastifyInstance } from 'fastify'
import redis from './redis'

interface SellOrderBody {
  stock_transaction_id: string
  stock_id: string
  stock_name: string
  user_id: string
  quantity: number
  price: number
}

async function routes(fastify: FastifyInstance) {
  fastify.post<{ Body: SellOrderBody }>('/orders/sell', async (request, reply) => {
    try {
      const { stock_transaction_id, stock_id, stock_name, user_id, quantity, price } = request.body

      const order = {
        stock_transaction_id,
        stock_id,
        stock_name,
        user_id,
        quantity,
        price,
        timestamp: Date.now()
      }

      await redis.sadd('stocks', stock_id)

      await redis.zadd(`sell_orders:${stock_id}`, price, JSON.stringify(order))

      return reply.send({ success: true, data: null })
    } catch (error) {
      return reply
        .status(500)
        .send({ success: false, data: null, message: 'Internal server error' })
    }
  })

  // TODO: Handle partial order
  fastify.post<{ Body: { stock: string } }>('/orders/buy', async (request, reply) => {
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
