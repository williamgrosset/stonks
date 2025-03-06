import Fastify from 'fastify'
import routes from './routes.js'

const PORT = process.env.PORT || 3003

const fastify = Fastify({ logger: { level: 'error' } })

fastify.register(routes)

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
