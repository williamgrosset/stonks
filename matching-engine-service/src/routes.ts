import { FastifyInstance } from 'fastify'
import ky from 'ky'
import redis from './redis.js'

interface SellOrderBody {
  stock_transaction_id: string
  stock_id: string
  stock_name: string
  user_id: string
  quantity: number
  price: number
}

interface BuyOrderBody
  extends Pick<SellOrderBody, 'stock_id' | 'stock_name' | 'user_id' | 'quantity'> {
  deduction: number
}

interface CancelOrderBody {
  stock_transaction_id: string
  user_id: string
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
        time_stamp: Date.now()
      }

      await redis.sadd('stocks', stock_id)

      await redis.zadd(`sell_orders:${stock_id}`, price, JSON.stringify(order))

      await redis.hset('sell_orders_index', stock_transaction_id, stock_id)

      return reply.send({ success: true, data: null })
    } catch (error) {
      console.error('Error processing sell order:', error)
      return reply.status(500).send({ success: false, data: { error: 'Internal server error' } })
    }
  })

  fastify.post<{ Body: BuyOrderBody }>('/orders/buy', async (request, reply) => {
    try {
      const { stock_id, stock_name, user_id, quantity, deduction } = request.body

      const sellOrder = await redis.zrange(`sell_orders:${stock_id}`, 0, 0)

      if (sellOrder.length === 0) {
        await ky.post('http://transaction-service:3001/orders/refund', {
          json: { user_id, amount: deduction }
        })

        return reply
          .status(400)
          .send({ success: false, data: null, message: 'No matching sell orders found' })
      }

      const sellOrderData = JSON.parse(sellOrder[0])

      if (sellOrderData.user_id === user_id) {
        await ky.post('http://transaction-service:3001/orders/refund', {
          json: { user_id, amount: deduction }
        })

        return reply
          .status(400)
          .send({ success: false, data: null, message: 'User cannot buy their own sell order' })
      }

      if (sellOrderData.quantity < quantity) {
        await ky.post('http://transaction-service:3001/orders/refund', {
          json: { user_id, amount: deduction }
        })

        return reply
          .status(400)
          .send({ success: false, data: null, message: 'Not enough stock available' })
      }

      let isPartial = false
      sellOrderData.quantity -= quantity

      if (sellOrderData.quantity === 0) {
        await redis.zpopmin(`sell_orders:${stock_id}`)
        await redis.hdel('sell_orders_index', sellOrderData.stock_transaction_id)
      } else {
        await redis.zrem(`sell_orders:${stock_id}`, sellOrder[0])
        await redis.zadd(
          `sell_orders:${stock_id}`,
          sellOrderData.price,
          JSON.stringify(sellOrderData)
        )
        isPartial = true
      }

      const trade = {
        buyer_id: user_id,
        seller_id: sellOrderData.user_id,
        stock_transaction_id: sellOrderData.stock_transaction_id,
        stock_id,
        stock_name,
        price: sellOrderData.price,
        quantity,
        is_partial: isPartial
      }

      await ky.post('http://transaction-service:3001/orders/complete', {
        json: { trade }
      })

      return reply.send({ success: true, data: null })
    } catch (error) {
      console.error('Error processing buy order:', error)
      return reply.status(500).send({ success: false, data: { error: 'Internal server error' } })
    }
  })

  fastify.post<{ Body: CancelOrderBody }>('/orders/cancel', async (request, reply) => {
    const { stock_transaction_id, user_id } = request.body

    try {
      const stock_id = await redis.hget('sell_orders_index', stock_transaction_id)

      const sellOrders = await redis.zrange(`sell_orders:${stock_id}`, 0, -1)

      let order = null

      for (let i = 0; i < sellOrders.length; i++) {
        const orderData = JSON.parse(sellOrders[i])

        if (
          orderData.stock_transaction_id === stock_transaction_id &&
          orderData.user_id === user_id
        ) {
          order = orderData
          break
        }
      }

      if (!order) {
        return reply
          .status(404)
          .send({ success: false, data: { error: 'Order not found or already executed' } })
      }

      await redis.zrem(`sell_orders:${stock_id}`, JSON.stringify(order))

      await redis.hdel('sell_orders_index', stock_transaction_id)

      await ky.post('http://transaction-service:3001/orders/cancel', {
        json: { stock_transaction_id }
      })

      return reply.send({ success: true, data: null })
    } catch (error) {
      console.error('Error cancelling sell order:', error)
      return reply.status(500).send({ success: false, data: { error: 'Internal server error' } })
    }
  })
}

export default routes
