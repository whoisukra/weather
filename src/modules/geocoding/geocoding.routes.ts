import { type FastifyInstance } from 'fastify'
import { GeocodingController } from './geocoding.controller.js'
import { GeocodingService } from './geocoding.service.js'

const geocodingService = new GeocodingService()
const geocodingController = new GeocodingController(geocodingService)

export async function geocodingRoutes(app: FastifyInstance) {
  app.get('/geocode', {
    schema: {
      description: 'Search for a city by name',
      tags: ['geocoding'],
      querystring: {
        type: 'object',
        properties: {
          q: { type: 'string', minLength: 2 },
        },
        required: ['q'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  state: { type: 'string' },
                  country: { type: 'string' },
                  latitude: { type: 'number' },
                  longitude: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
    handler: geocodingController.search.bind(geocodingController),
  })
}
