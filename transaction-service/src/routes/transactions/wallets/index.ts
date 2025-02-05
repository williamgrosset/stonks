import { FastifyInstance } from 'fastify'
import prisma from '../../../prisma'

const WALLET_TRANSACTIONS_PATH = '/transactions/wallets'

interface WalletTransactionInput {
  user_id: number
  amount: number
  is_debit: boolean
}

async function walletTransactionRoutes(fastify: FastifyInstance) {
  fastify.get<{ Querystring: { user_id?: string } }>(
    WALLET_TRANSACTIONS_PATH,
    async (request, reply) => {
      try {
        const { user_id } = request.query

        const transactions = await prisma.wallet_transactions.findMany({
          where: user_id ? { user_id: parseInt(user_id) } : undefined
        })

        return reply.send(transactions)
      } catch (error) {
        return reply.status(500).send({ error: 'Error fetching wallet transactions' })
      }
    }
  )

  fastify.post<{ Body: WalletTransactionInput }>(
    WALLET_TRANSACTIONS_PATH,
    async (request, reply) => {
      try {
        const { user_id, amount, is_debit } = request.body

        const transaction = await prisma.wallet_transactions.create({
          data: {
            user_id,
            amount,
            is_debit
          }
        })

        return reply.status(201).send(transaction)
      } catch (error) {
        return reply.status(500).send({ error: 'Error creating wallet transaction' })
      }
    }
  )
}

export default walletTransactionRoutes
