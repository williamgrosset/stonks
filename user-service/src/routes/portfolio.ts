import { FastifyInstance } from 'fastify'

async function routes(fastify: FastifyInstance) {
  fastify.get('/users/portfolio', async (request, reply) => {})
}

export default routes
