import { FastifyInstance } from 'fastify'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

const SECRET_KEY = process.env.JWT_SECRET || 'supersecret'

async function authRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: { username: string; password: string } }>(
    '/register',
    async (request, reply) => {
      try {
        const { username, password } = request.body

        if (!username || !password) {
          return reply.status(400).send({ message: 'Missing fields' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.users.create({
          data: {
            user_name: username,
            password: hashedPassword
          },
          select: {
            id: true,
            user_name: true
          }
        })

        return reply.status(201).send({ user })
      } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )

  fastify.post<{ Body: { username: string; password: string } }>(
    '/login',
    async (request, reply) => {
      try {
        const { username, password } = request.body

        const user = await prisma.users.findUnique({
          where: {
            user_name: username
          }
        })

        if (!user || !(await bcrypt.compare(password, user.password))) {
          return reply.status(401).send({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({ id: user.id, username: user.user_name }, SECRET_KEY, {
          expiresIn: '1h'
        })

        return reply.send({ token })
      } catch (error) {
        return reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )
}

export default authRoutes
