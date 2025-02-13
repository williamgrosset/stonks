import { FastifyInstance } from 'fastify'
import redis from '../redis'

async function routes(fastify: FastifyInstance) {
  fastify.get('/stocks/prices', async (request, reply) => {
    try {
      const stockIds = await redis.smembers('stocks')

      if (!stockIds.length) {
        return reply.send([])
      }

      const stockPrices = []

      for (const stockId of stockIds) {
        const orderData = await redis.zrange(`sell_orders:${stockId}`, 0, 0)

        if (orderData.length > 0) {
          const order = JSON.parse(orderData[0])

          stockPrices.push({
            stock_id: order.stock_id,
            stock_name: order.stock_name,
            current_price: order.price
          })
        }
      }

      reply.send({ success: true, data: stockPrices })
    } catch (error) {
      console.error('Error fetching stock prices:', error)
      reply.status(500).send({ success: false, data: null, message: 'Internal Server Error' })
    }
  })
}

export default routes
