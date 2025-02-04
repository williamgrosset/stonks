import { FastifyInstance } from 'fastify'

const PATH = '/transactions'

const transactions: object[] = []

interface Body {
  amount: string
  type: string
  description: string
}

async function routes(fastify: FastifyInstance) {
  fastify.get(PATH, async (request, reply) => {
    return transactions
  })

  fastify.post<{ Body: Body }>(PATH, async (request, reply) => {
    const { amount, type, description } = request.body

    transactions.push({ amount, type, description })

    reply.status(201).send(transactions)
  })
}

export default routes
