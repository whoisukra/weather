import Fastify from 'fastify'
import { setErrorHandler } from '../src/shared/http/error-handler.js'
import { weatherRoutes } from '../src/modules/weather/weather.routes.js'

export function buildApp() {
  const app = Fastify({
    logger: false,
  })

  setErrorHandler(app)
  app.register(weatherRoutes)

  return app
}
