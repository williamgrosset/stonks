import Fastify from 'fastify'
import stockTransactionRoutes from './routes/stocks'
import walletTransactionRoutes from './routes/wallets'

const PORT = process.env.PORT || 3000

const fastify = Fastify({ logger: true })

fastify.register(stockTransactionRoutes)
fastify.register(walletTransactionRoutes)

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
