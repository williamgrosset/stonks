import Fastify from 'fastify'
import authRoutes from './routes/auth'
import setupRoutes from './routes/setup'
import walletRoutes from './routes/wallet'
import portfolioRoutes from './routes/portfolio'

const PORT = process.env.PORT || 3000

const fastify = Fastify({ logger: true })

fastify.register(authRoutes)
fastify.register(setupRoutes)
fastify.register(walletRoutes)
fastify.register(portfolioRoutes)

const start = async () => {
  try {
    await fastify.listen({ port: Number(PORT), host: '0.0.0.0' })
    console.log(`Fastify server running on http://localhost:${PORT}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
