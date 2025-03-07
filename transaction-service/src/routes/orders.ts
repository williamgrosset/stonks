import { FastifyInstance } from 'fastify'
import prisma from '../prisma.js'

interface RefundOrderBody {
  user_id: string
  amount: number
}

interface CancelOrderBody {
  stock_transaction_id: string
}

interface CompleteOrderBody {
  buyer_id: string
  seller_id: string
  stock_transaction_id: string
  stock_id: string
  stock_name: string
  price: number
  quantity: number
  is_partial: boolean
}

async function routes(fastify: FastifyInstance) {
  fastify.post<{ Body: RefundOrderBody }>('/orders/refund', async (request, reply) => {
    const { user_id, amount } = request.body

    try {
      await prisma.users.update({
        where: { id: parseInt(user_id) },
        data: {
          wallet_balance: { increment: amount }
        }
      })

      return reply.send({ success: true, data: null })
    } catch (error) {
      console.error('Error issuing refund:', error)
      return reply.status(500).send({ success: false, data: { error: 'Internal server error' } })
    }
  })

  fastify.post<{ Body: CancelOrderBody }>('/orders/cancel', async (request, reply) => {
    const { stock_transaction_id } = request.body

    try {
      const stockTransaction = await prisma.stock_transactions.findUniqueOrThrow({
        where: { id: parseInt(stock_transaction_id) },
        include: {
          child_transactions: true
        }
      })

      let quantity = stockTransaction.quantity

      for (const child of stockTransaction.child_transactions) {
        quantity -= child.quantity
      }

      if (quantity > 0) {
        await prisma.shares.update({
          where: {
            stock_id_user_id: {
              stock_id: stockTransaction.stock_id,
              user_id: stockTransaction.user_id
            }
          },
          data: {
            quantity: { increment: quantity }
          }
        })
      }

      await prisma.stock_transactions.update({
        where: { id: stockTransaction.id },
        data: { order_status: 'CANCELLED' }
      })

      return reply.send({ success: true, data: null })
    } catch (error) {
      console.error('Error cancelling order:', error)
      return reply.status(500).send({ success: false, data: { error: 'Internal server error' } })
    }
  })

  fastify.post<{ Body: CompleteOrderBody }>('/orders/complete', async (request, reply) => {
    const { buyer_id, seller_id, stock_transaction_id, stock_id, price, quantity, is_partial } =
      request.body
    const buyerIdInt = parseInt(buyer_id)
    const sellerIdInt = parseInt(seller_id)
    const stockTransactionIdInt = parseInt(stock_transaction_id)
    const stockIdInt = parseInt(stock_id)

    try {
      // 1) Upsert the buyer’s shares
      await prisma.shares.upsert({
        where: {
          stock_id_user_id: {
            stock_id: stockIdInt,
            user_id: buyerIdInt
          }
        },
        update: { quantity: { increment: quantity } },
        create: {
          stock_id: stockIdInt,
          user_id: buyerIdInt,
          quantity
        }
      })

      // 2) Create the BUYER's wallet transaction
      const buyerWalletTx = await prisma.wallet_transactions.create({
        data: {
          user_id: buyerIdInt,
          is_debit: true,
          amount: price * quantity
        }
      })

      // 3) Create the BUYER's stock transaction (pointing to buyerWalletTx.id)
      await prisma.stock_transactions.create({
        data: {
          stock_id: stockIdInt,
          user_id: buyerIdInt,
          order_status: 'COMPLETED',
          order_type: 'MARKET',
          quantity,
          price,
          wallet_transaction_id: buyerWalletTx.id
        }
      })

      // 4) Update the SELLER’s wallet balance
      await prisma.users.update({
        where: { id: sellerIdInt },
        data: {
          wallet_balance: { increment: price * quantity }
        }
      })

      // 5) Handle partial-fill logic vs. full fill
      if (is_partial) {
        // 5a) Create the SELLER's wallet transaction for the partial fill
        const sellerWalletTx = await prisma.wallet_transactions.create({
          data: {
            user_id: sellerIdInt,
            is_debit: false,
            amount: price * quantity
          }
        })

        // 5b) Create the "child" stock transaction referencing parent_stock_transaction_id
        await prisma.stock_transactions.create({
          data: {
            parent_stock_transaction_id: stockTransactionIdInt,
            stock_id: stockIdInt,
            user_id: sellerIdInt,
            order_status: 'COMPLETED',
            order_type: 'LIMIT',
            quantity,
            price,
            wallet_transaction_id: sellerWalletTx.id
          }
        })

        // 5c) Update the parent transaction to PARTIALLY_COMPLETE
        return prisma.stock_transactions.update({
          where: { id: stockTransactionIdInt },
          data: { order_status: 'PARTIALLY_COMPLETE' }
        })
      } else {
        // Not partial => just finalize the parent transaction
        const sellerWalletTx = await prisma.wallet_transactions.create({
          data: {
            user_id: sellerIdInt,
            is_debit: false,
            amount: price * quantity
          }
        })

        return prisma.stock_transactions.update({
          where: { id: stockTransactionIdInt },
          data: {
            order_status: 'COMPLETED',
            wallet_transaction_id: sellerWalletTx.id
          }
        })
      }

      return reply.send({ success: true, data: null })
    } catch (error) {
      console.error('Error completing order:', error)
      return reply.status(500).send({ success: false, data: { error: 'Internal server error' } })
    }
  })
}

export default routes
