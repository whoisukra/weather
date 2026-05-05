import { type FastifyError, type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify'
import { WeatherServiceError } from '../../modules/weather/weather.errors.js'

export function setErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    app.log.error({ err: error, req: request }, 'Request error')

    if (error instanceof WeatherServiceError) {
      return reply.status(error.statusCode).send({
        error: error.name,
        message: error.message,
      })
    }

    if (error.validation) {
      return reply.status(400).send({
        error: 'ValidationError',
        message: error.message,
        details: error.validation,
      })
    }

    return reply.status(500).send({
      error: 'InternalServerError',
      message: 'An unexpected error occurred',
    })
  })
}
