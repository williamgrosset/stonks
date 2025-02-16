import { FastifyInstance } from 'fastify'
import { prisma } from 'prisma-client'
import { normalizeShare } from '../normalize.js'

async function routes(fastify: FastifyInstance) {
  fastify.get('/users/portfolio', async (request, reply) => {
    try {
      const user_id = request.headers['x-user-id'] as string

      const shares = await prisma.shares.findMany({
        where: { id: parseInt(user_id) },
        include: {
          stock: {
            select: {
              stock_name: true
            }
          }
        }
      })

      const formattedShares = shares.map(normalizeShare)

      return reply.status(200).send({ success: true, data: formattedShares })
    } catch (error) {
      return reply.status(500).send({ success: false, data: { error: 'Internal server error' } })
    }
  })
}

export default routes
