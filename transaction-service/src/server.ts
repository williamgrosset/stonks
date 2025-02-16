import Fastify from 'fastify'
import stocksRoutes from './routes/stocks.js'
import walletsRoutes from './routes/wallets.js'

const PORT = process.env.PORT || 3001

const fastify = Fastify({ logger: true })

fastify.register(stocksRoutes)
fastify.register(walletsRoutes)

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
