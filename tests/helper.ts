import Fastify from 'fastify'
import { setErrorHandler } from '../src/shared/http/error-handler.js'
import { weatherRoutes } from '../src/modules/weather/weather.routes.js'
import { healthRoutes } from '../src/modules/health/health.routes.js'

export function buildApp() {
  const app = Fastify({
    logger: false,
  })

  setErrorHandler(app)
  app.register(healthRoutes)
  app.register(weatherRoutes)

  return app
}
