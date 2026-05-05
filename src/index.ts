import Fastify from 'fastify'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifyStatic from '@fastify/static'
import { env } from './shared/config/env.js'
import { setErrorHandler } from './shared/http/error-handler.js'
import { weatherRoutes } from './modules/weather/weather.routes.js'
import { geocodingRoutes } from './modules/geocoding/geocoding.routes.js'
import { healthRoutes } from './modules/health/health.routes.js'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const server = Fastify({
  logger: {
    level: env.nodeEnv === 'development' ? 'debug' : 'info',
  },
})

await server.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute',
})

setErrorHandler(server)

server.register(healthRoutes)
server.register(geocodingRoutes)
server.register(weatherRoutes)

if (env.nodeEnv === 'production') {
  const distPath = resolve(__dirname, '../../front/dist')
  await server.register(fastifyStatic, {
    root: distPath,
    prefix: '/',
  })

  server.setNotFoundHandler(async (request, reply) => {
    if (!request.url.startsWith('/api')) {
      return reply.sendFile('index.html', distPath)
    }
    return reply.status(404).send({ error: 'NotFound', message: 'Route not found' })
  })
}

const start = async () => {
  try {
    await server.listen({ port: env.port })
    server.log.info(`Server running at http://localhost:${env.port}`)
  } catch (err) {
    server.log.error(err, 'Failed to start server')
    process.exit(1)
  }
}

const gracefulShutdown = async (signal: string) => {
  server.log.info(`Received ${signal}, shutting down gracefully`)
  await server.close()
  process.exit(0)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

start()
