import { type FastifyRequest } from 'fastify'
import { env } from '../../shared/config/env.js'
import { type WeatherService } from './weather.service.js'

interface WeatherQuery {
  lat?: string
  long?: string
  city?: string
  state?: string
}

export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  async handle(request: FastifyRequest<{ Querystring: WeatherQuery }>) {
    const latitude = request.query.lat ? Number(request.query.lat) : env.weatherLatitude
    const longitude = request.query.long ? Number(request.query.long) : env.weatherLongitude
    const city = request.query.city || env.weatherCity
    const state = request.query.state || env.weatherState

    const { current, forecast, details, hourly } = await this.weatherService.getCurrentWeather({
      latitude,
      longitude,
    })

    return {
      city,
      state,
      current,
      forecast,
      details,
      hourly,
    }
  }
}
