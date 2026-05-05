import { type FastifyInstance } from 'fastify'
import { WeatherController } from './weather.controller.js'
import { WeatherService } from './weather.service.js'

const weatherService = new WeatherService()
const weatherController = new WeatherController(weatherService)

export async function weatherRoutes(app: FastifyInstance) {
  app.get('/weather', {
    schema: {
      description: 'Get current temperature and 3-day forecast',
      tags: ['weather'],
      querystring: {
        type: 'object',
        properties: {
          lat: { type: 'string', pattern: '^-?\\d+\\.?\\d*$' },
          long: { type: 'string', pattern: '^-?\\d+\\.?\\d*$' },
          city: { type: 'string' },
          state: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            city: { type: 'string' },
            state: { type: 'string' },
            current: {
              type: 'object',
              properties: {
                time: { type: 'string', format: 'date-time' },
                temperature: { type: 'number' },
                weatherCode: { type: 'number' },
                unit: { type: 'string' },
              },
            },
            forecast: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string', format: 'date' },
                  temperatureMin: { type: 'number' },
                  temperatureMax: { type: 'number' },
                  weatherCode: { type: 'number' },
                  unit: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    handler: weatherController.handle.bind(weatherController),
  })
}
