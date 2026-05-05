import { env } from '../../shared/config/env.js'
import { type WeatherService } from './weather.service.js'

export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  async handle() {
    const { current, forecast } = await this.weatherService.getCurrentWeather({
      latitude: env.weatherLatitude,
      longitude: env.weatherLongitude,
    })

    return {
      city: env.weatherCity,
      state: env.weatherState,
      current,
      forecast,
    }
  }
}
