import { FastifyInstance } from 'fastify'
import redis from '../redis.js'

async function routes(fastify: FastifyInstance) {
  fastify.get('/stocks/prices', async (request, reply) => {
    try {
      const stockIds = await redis.smembers('stocks')

      if (!stockIds.length) {
        return reply.send([])
      }

      const stockPrices = await Promise.all(
        stockIds.map(async stockId => {
          const orderData = await redis.zrange(`sell_orders:${stockId}`, 0, 0)

          if (orderData.length > 0) {
            const order = JSON.parse(orderData[0])

            return {
              stock_id: order.stock_id,
              stock_name: order.stock_name,
              current_price: order.price
            }
          }

          return null
        })
      )

      const prices = stockPrices
        .filter(Boolean)
        .sort((a, b) => b!.stock_name.localeCompare(a!.stock_name))

      reply.send({ success: true, data: prices })
    } catch (error) {
      console.error('Error fetching stock prices:', error)
      reply.status(500).send({ success: false, data: { error: 'Internal Server Error' } })
    }
  })
}

export default routes
