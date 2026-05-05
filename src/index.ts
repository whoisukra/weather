import Fastify from 'fastify'
import { env } from './shared/config/env.js'
import { setErrorHandler } from './shared/http/error-handler.js'
import { weatherRoutes } from './modules/weather/weather.routes.js'
import { geocodingRoutes } from './modules/geocoding/geocoding.routes.js'

const server = Fastify({
  logger: {
    level: env.nodeEnv === 'development' ? 'debug' : 'info',
  },
})

setErrorHandler(server)

server.register(geocodingRoutes)
server.register(weatherRoutes)

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
