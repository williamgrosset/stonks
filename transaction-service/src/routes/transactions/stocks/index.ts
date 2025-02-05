import { FastifyInstance } from 'fastify'
import prisma from '../../../prisma'

const STOCK_TRANSACTIONS_PATH = '/transactions/stocks'

interface StockTransactionInput {
  stock_id: number
  user_id: number
  order_status: string
  order_type: string
  quantity: number
  price: number
  parent_stock_transaction_id?: number
}

async function stockTransactionRoutes(fastify: FastifyInstance) {
  fastify.get<{ Querystring: { user_id?: string } }>(
    STOCK_TRANSACTIONS_PATH,
    async (request, reply) => {
      try {
        const { user_id } = request.query

        const transactions = await prisma.stock_transactions.findMany({
          where: user_id ? { user_id: parseInt(user_id) } : undefined
        })

        return reply.send(transactions)
      } catch (error) {
        return reply.status(500).send({ error: 'Error fetching stock transactions' })
      }
    }
  )

  fastify.post<{ Body: StockTransactionInput }>(STOCK_TRANSACTIONS_PATH, async (request, reply) => {
    const {
      stock_id,
      user_id,
      order_status,
      order_type,
      quantity,
      price,
      parent_stock_transaction_id
    } = request.body
    try {
      const transaction = await prisma.stock_transactions.create({
        data: {
          stock_id,
          user_id,
          order_status,
          order_type,
          quantity,
          price,
          parent_stock_transaction_id
        }
      })

      return reply.status(201).send(transaction)
    } catch (error) {
      return reply.status(500).send({ error: 'Error creating stock transaction' })
    }
  })

  fastify.put<{ Params: { transaction_id: string }; Body: Partial<StockTransactionInput> }>(
    `${STOCK_TRANSACTIONS_PATH}/:transaction_id`,
    async (request, reply) => {
      const { transaction_id } = request.params
      const {
        stock_id,
        user_id,
        order_status,
        order_type,
        quantity,
        price,
        parent_stock_transaction_id
      } = request.body

      try {
        const existingTransaction = await prisma.stock_transactions.findUnique({
          where: { transaction_id: Number(transaction_id) }
        })

        if (!existingTransaction) {
          return reply.status(404).send({ error: 'Stock transaction not found' })
        }

        const updatedTransaction = await prisma.stock_transactions.update({
          where: { transaction_id: Number(transaction_id) },
          data: {
            stock_id,
            user_id,
            order_status,
            order_type,
            quantity,
            price,
            parent_stock_transaction_id
          }
        })

        return reply.status(200).send(updatedTransaction)
      } catch (error) {
        console.error(error)
        return reply.status(500).send({ error: 'Error updating stock transaction' })
      }
    }
  )
}

export default stockTransactionRoutes
