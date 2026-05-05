import { type FastifyReply, type FastifyRequest } from 'fastify'
import { type GeocodingService } from './geocoding.service.js'

export class GeocodingController {
  constructor(private readonly geocodingService: GeocodingService) {}

  async search(request: FastifyRequest<{ Querystring: { q: string } }>, reply: FastifyReply) {
    const query = request.query.q

    if (!query || query.length < 2) {
      return reply.status(400).send({
        error: 'ValidationError',
        message: 'Query must be at least 2 characters',
      })
    }

    const results = await this.geocodingService.searchCity(query)

    return results
  }
}
