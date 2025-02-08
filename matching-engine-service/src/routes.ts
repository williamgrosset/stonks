import { FastifyInstance } from 'fastify'

async function routes(fastify: FastifyInstance) {
  fastify.post<{ Body: { username: string; password: string } }>(
    '/buy',
    async (request, reply) => {}
  )

  fastify.post<{ Body: { username: string; password: string } }>(
    '/sell',
    async (request, reply) => {}
  )
}

export default routes
