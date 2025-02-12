import { FastifyInstance } from 'fastify'

async function routes(fastify: FastifyInstance) {
  fastify.get('/wallet', async (request, reply) => {})
  fastify.post('/wallet/deposit', async (request, reply) => {})
}

export default routes
