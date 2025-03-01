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
      await prisma.$transaction(async prisma => {
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
      await prisma.$transaction(async tx => {
        // ---------- BUYER -----------
        // Add shares to user
        await tx.shares.upsert({
          where: {
            stock_id_user_id: {
              stock_id: stockIdInt,
              user_id: buyerIdInt
            }
          },
          update: {
            quantity: { increment: quantity }
          },
          create: {
            stock_id: stockIdInt,
            user_id: buyerIdInt,
            quantity
          }
        })

        // Create wallet transaction
        const buyerWalletTx = await tx.wallet_transactions.create({
          data: {
            user_id: buyerIdInt,
            is_debit: true,
            amount: price * quantity
          }
        })

        // Create `COMPLETED` stock transaction
        await tx.stock_transactions.create({
          data: {
            stock_id: stockIdInt,
            user_id: buyerIdInt,
            wallet_transaction_id: buyerWalletTx.id,
            order_status: 'COMPLETED',
            order_type: 'MARKET',
            quantity,
            price
          }
        })

        // ---------- SELLER -----------
        // Add funds to user
        await tx.users.update({
          where: { id: sellerIdInt },
          data: {
            wallet_balance: { increment: price * quantity }
          }
        })

        // Create wallet transaction
        const sellerWalletTx = await tx.wallet_transactions.create({
          data: {
            user_id: sellerIdInt,
            is_debit: false,
            amount: price * quantity
          }
        })

        if (is_partial) {
          // Create `COMPLETED` child stock transaction
          await tx.stock_transactions.create({
            data: {
              parent_stock_transaction_id: stockTransactionIdInt,
              stock_id: stockIdInt,
              user_id: sellerIdInt,
              wallet_transaction_id: sellerWalletTx.id,
              order_status: 'COMPLETED',
              order_type: 'LIMIT',
              quantity,
              price
            }
          })

          // Update stock transaction to `PARTIALLY_COMPLETE`
          return await tx.stock_transactions.update({
            where: { id: stockTransactionIdInt },
            data: { order_status: 'PARTIALLY_COMPLETE' }
          })
        } else {
          // Update stock transaction to `COMPLETED`
          return await tx.stock_transactions.update({
            where: { id: stockTransactionIdInt },
            data: { order_status: 'COMPLETED', wallet_transaction_id: sellerWalletTx.id }
          })
        }
      })

      return reply.send({ success: true, data: null })
    } catch (error) {
      console.error('Error completing order:', error)
      return reply.status(500).send({ success: false, data: { error: 'Internal server error' } })
    }
  })
}

export default routes
