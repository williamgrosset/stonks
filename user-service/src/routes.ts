import { FastifyInstance } from 'fastify'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const SECRET_KEY = process.env.JWT_SECRET || 'supersecret'

const users: { id: number; username: string; password: string }[] = []

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
        users.push({ id: users.length + 1, username, password: hashedPassword })

        return reply.status(201).send({ message: 'User registered' })
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
        const user = users.find(u => u.username === username)

        if (!user || !(await bcrypt.compare(password, user.password))) {
          return reply.status(401).send({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
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
