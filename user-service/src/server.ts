import Fastify from 'fastify'
import fastifyMetrics from 'fastify-metrics'
import authRoutes from './routes/auth.js'
import setupRoutes from './routes/setup.js'
import walletRoutes from './routes/wallet.js'
import portfolioRoutes from './routes/portfolio.js'

const PORT = process.env.PORT || 3000

const fastify = Fastify({ logger: { level: 'error' } })

// @ts-ignore
fastify.register(fastifyMetrics, {
  endpoint: '/metrics',
  routeMetrics: {
    enabled: true,
    // @ts-ignore
    routeTags: req => ({
      route: req.routerPath,
      method: req.method
    })
  },
  defaultMetrics: {
    enabled: true
  }
})

fastify.register(authRoutes)
fastify.register(setupRoutes)
fastify.register(walletRoutes)
fastify.register(portfolioRoutes)

const start = async () => {
  try {
    await fastify.listen({ port: Number(PORT), host: '0.0.0.0' })
    console.log(`Fastify server running on http://localhost:${PORT}`)
    console.log(`Metrics available at http://localhost:${PORT}/metrics`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
