import { FastifyInstance } from 'fastify'
import ky from 'ky'
import prisma from '../prisma'
import redis from '../redis'

type Order = 'LIMIT' | 'MARKET'

interface StockOrderBody {
  stock_id: string
  is_buy: boolean
  order_type: Order
  quantity: number
  price?: number
}

async function routes(fastify: FastifyInstance) {
  fastify.post<{ Body: StockOrderBody }>('/orders', async (request, reply) => {
    const user_id = request.headers['x-user-id'] as string
    const { stock_id, is_buy, order_type, quantity, price } = request.body

    if (!user_id || !stock_id || !order_type || !quantity) {
      return reply.status(400).send({ success: false, data: null, message: 'Missing fields' })
    }

    if (order_type === 'MARKET' && price) {
      return reply
        .status(400)
        .send({ success: false, data: null, message: 'Price field not permitted with a buy order' })
    }

    if (order_type === 'LIMIT' && !price) {
      return reply
        .status(400)
        .send({ success: false, data: null, message: 'Price field required with a sell order' })
    }

    try {
      const user = await prisma.users.findUniqueOrThrow({
        where: { id: parseInt(user_id) },
        include: { shares: true }
      })

      const stock = await prisma.stocks.findUniqueOrThrow({
        where: { id: parseInt(stock_id) }
      })

      if (is_buy && order_type === 'MARKET') {
        const orderData = await redis.zrange(`sell_orders:${stock_id}`, 0, 0)

        if (orderData.length === 0) {
          return reply
            .status(400)
            .send({ success: false, data: null, message: 'No available sell orders' })
        }

        const lowestSellOrder = JSON.parse(orderData[0])
        const price = lowestSellOrder.price * quantity
        const currBalance = user.wallet_balance.toNumber()

        if (currBalance < price) {
          return reply
            .status(400)
            .send({ success: false, data: null, message: 'Insufficient funds' })
        }

        const updatedBalance = currBalance - price

        await prisma.users.update({
          where: { id: parseInt(user_id) },
          data: {
            wallet_balance: updatedBalance
          }
        })

        await ky.post('http://matching-engine:3003/orders/buy', {
          json: { stock_id, user_id, order_type, quantity }
        })

        return reply.status(200).send({ success: true, data: null })
      } else if (!is_buy && order_type === 'LIMIT') {
        const userShares = await prisma.shares.findFirst({
          where: { user_id: user.id, stock_id: stock.id }
        })

        if (!userShares || userShares.quantity < quantity) {
          return reply
            .status(400)
            .send({ success: false, data: null, message: 'Insufficient shares' })
        }

        await prisma.$transaction(async tx => {
          await tx.shares.update({
            where: { id: userShares.id },
            data: { quantity: userShares.quantity - quantity }
          })

          return tx.stock_transactions.create({
            data: {
              stock_id: stock.id,
              user_id: user.id,
              order_status: 'IN_PROGRESS',
              order_type,
              quantity,
              price: price!
            }
          })
        })

        await ky.post('http://matching-engine:3003/orders/sell', {
          json: { stock_id, user_id, order_type, quantity, price }
        })

        return reply.status(200).send({ success: true, data: null })
      }

      return reply.status(400).send({
        success: true,
        data: null,
        message: 'Must provide a valid buy order or sell order'
      })
    } catch (error) {
      console.error('Error processing order:', error)
      return reply
        .status(500)
        .send({ success: false, data: null, message: 'Internal server error' })
    }
  })
}

export default routes
