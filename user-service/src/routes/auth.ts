import { FastifyInstance } from 'fastify'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import prisma from '../prisma.js'

const SECRET_KEY = 'supersecret'

interface LoginBody {
  user_name: string
  password: string
}

interface RegisterBody extends LoginBody {
  name?: string
}

async function routes(fastify: FastifyInstance) {
  fastify.post<{ Body: RegisterBody }>('/register', async (request, reply) => {
    try {
      const { user_name, password, name } = request.body

      if (!user_name || !password) {
        return reply.status(400).send({ success: false, data: { error: 'Missing fields' } })
      }

      const hashedPassword = await bcrypt.hash(password, 1)

      await prisma.users.create({
        data: {
          user_name,
          password: hashedPassword,
          display_name: name
        }
      })

      return reply.status(201).send({ success: true, data: null })
    } catch (error) {
      return reply.status(400).send({ success: false, data: { error: 'User already exists' } })
    }
  })

  fastify.post<{ Body: LoginBody }>('/login', async (request, reply) => {
    try {
      const { user_name, password } = request.body

      const user = await prisma.users.findUnique({
        where: {
          user_name
        }
      })

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return reply.status(400).send({ success: false, data: { error: 'Invalid credentials' } })
      }

      const token = jwt.sign({ user_id: user.id }, SECRET_KEY, {
        expiresIn: '1hr'
      })

      return reply.send({ success: true, data: { token } })
    } catch (error) {
      return reply.status(500).send({ success: false, data: { error: 'Internal server error' } })
    }
  })
}

export default routes
