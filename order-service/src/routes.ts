import { FastifyInstance } from 'fastify'
import prisma from './prisma'

async function routes(fastify: FastifyInstance) {
  fastify.get<{ Body: { username: string; password: string } }>(
    '/stock-price',
    async (request, reply) => {}
  )

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
