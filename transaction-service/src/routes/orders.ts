import { FastifyInstance } from 'fastify'
import prisma from '../prisma'
import { warn } from 'console'

interface RefundOrderBody {
  user_id: string
  amount: number
}

interface CancelOrderBody {
  stock_transaction_id: string
}

interface CompleteOrderBody {
  trade: {
    buyer_id: string
    seller_id: string
    stock_transaction_id: string
    stock_id: string
    stock_name: string
    price: number
    quantity: number
    is_partial: boolean
  }
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
      return reply
        .status(500)
        .send({ success: false, data: null, message: 'Internal server error' })
    }
  })

  fastify.post<{ Body: CancelOrderBody }>('/orders/cancel', async (request, reply) => {
    const { stock_transaction_id } = request.body

    try {
      await prisma.stock_transactions.update({
        where: { id: parseInt(stock_transaction_id) },
        data: {
          order_status: 'CANCELLED'
        }
      })

      return reply.send({ success: true, data: null })
    } catch (error) {
      console.error('Error cancelling order:', error)
      return reply
        .status(500)
        .send({ success: false, data: null, message: 'Internal server error' })
    }
  })

  fastify.post<{ Body: CompleteOrderBody }>('/orders/complete', async (request, reply) => {
    const { trade } = request.body

    try {
      const transaction = await prisma.$transaction(async tx => {
        // ---------- BUYER -----------
        // Add shares to user
        const existingShares = await tx.shares.findFirst({
          where: { user_id: parseInt(trade.buyer_id), stock_id: parseInt(trade.stock_id) }
        })

        if (existingShares) {
          await tx.shares.update({
            where: { id: existingShares.id },
            data: { quantity: { increment: trade.quantity } }
          })
        } else {
          await tx.shares.create({
            data: {
              stock_id: parseInt(trade.stock_id),
              user_id: parseInt(trade.buyer_id),
              quantity: trade.quantity
            }
          })
        }

        // Create deducted wallet transaction
        const buyerWalletTx = await tx.wallet_transactions.create({
          data: {
            user_id: parseInt(trade.buyer_id),
            is_debit: false,
            amount: trade.price
          }
        })

        // Create stock transaction
        await tx.stock_transactions.create({
          data: {
            stock_id: parseInt(trade.stock_id),
            user_id: parseInt(trade.buyer_id),
            wallet_transaction_id: buyerWalletTx.id,
            order_status: 'COMPLETED',
            order_type: 'MARKET',
            quantity: trade.quantity,
            price: trade.price
          }
        })

        // ---------- SELLER -----------
        // Add funds to user
        await tx.users.update({
          where: { id: parseInt(trade.seller_id) },
          data: {
            wallet_balance: { increment: trade.price * trade.quantity }
          }
        })

        // Create debited wallet transaction
        const sellerWalletTx = await tx.wallet_transactions.create({
          data: {
            user_id: parseInt(trade.seller_id),
            is_debit: true,
            amount: trade.price
          }
        })

        if (trade.is_partial) {
          // Create child stock transaction
          await tx.stock_transactions.create({
            data: {
              parent_stock_transaction_id: parseInt(trade.stock_transaction_id),
              stock_id: parseInt(trade.stock_id),
              user_id: parseInt(trade.seller_id),
              wallet_transaction_id: sellerWalletTx.id,
              order_status: 'COMPLETED',
              order_type: 'LIMIT',
              quantity: trade.quantity,
              price: trade.price
            }
          })

          // Update stock transaction to PARTIALLY_COMPLETE
          return await tx.stock_transactions.update({
            where: { id: parseInt(trade.stock_transaction_id) },
            data: { order_status: 'PARTIALLY_COMPLETE' }
          })
        } else {
          // Update stock transaction to COMPLETED
          return await tx.stock_transactions.update({
            where: { id: parseInt(trade.stock_transaction_id) },
            data: { order_status: 'COMPLETED', wallet_transaction_id: sellerWalletTx.id }
          })
        }
      })

      return reply.send({ success: true, data: transaction })
    } catch (error) {
      console.error('Error completing order:', error)
      return reply
        .status(500)
        .send({ success: false, data: null, message: 'Internal server error' })
    }
  })
}

export default routes
