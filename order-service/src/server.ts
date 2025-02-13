import Fastify from 'fastify'
import pricesRoutes from './routes/prices'

const PORT = process.env.PORT || 3002

const fastify = Fastify({ logger: true })

fastify.register(pricesRoutes)

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
