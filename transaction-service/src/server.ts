import Fastify from 'fastify'
import fastifyMetrics from 'fastify-metrics'
import stocksRoutes from './routes/stocks.js'
import walletsRoutes from './routes/wallets.js'
import ordersRoutes from './routes/orders.js'

const PORT = process.env.PORT || 3001

const fastify = Fastify({ logger: true })

// @ts-ignore
fastify.register(fastifyMetrics, { endpoint: '/metrics' })

fastify.register(stocksRoutes)
fastify.register(walletsRoutes)
fastify.register(ordersRoutes)

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
