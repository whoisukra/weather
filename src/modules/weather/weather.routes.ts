import { type FastifyInstance } from 'fastify'
import { WeatherController } from './weather.controller.js'
import { WeatherService } from './weather.service.js'

const weatherService = new WeatherService()
const weatherController = new WeatherController(weatherService)

export async function weatherRoutes(app: FastifyInstance) {
  app.get('/weather', {
    schema: {
      description: 'Get current weather, forecast, and details',
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
                apparentTemperature: { type: 'number' },
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
            details: {
              type: 'object',
              properties: {
                humidity: { type: 'number' },
                windSpeed: { type: 'number' },
                windDirection: { type: 'number' },
                uvIndex: { type: 'number' },
                sunrise: { type: 'string' },
                sunset: { type: 'string' },
                apparentTemperature: { type: 'number' },
                pressure: { type: 'number' },
              },
            },
            hourly: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  time: { type: 'string' },
                  temperature: { type: 'number' },
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
