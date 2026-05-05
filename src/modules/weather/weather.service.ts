import { env } from '../../shared/config/env.js'
import { WeatherServiceError } from './weather.errors.js'
import { type Coordinate, type CurrentWeather, type DailyForecast } from './weather.types.js'

interface OpenMeteoResponse {
  current: {
    time: string
    temperature_2m: number
  }
  daily: {
    time: string[]
    temperature_2m_min: number[]
    temperature_2m_max: number[]
  }
}

export class WeatherService {
  async getCurrentWeather(coordinate: Coordinate): Promise<{ current: CurrentWeather; forecast: DailyForecast[] }> {
    const params = new URLSearchParams({
      latitude: coordinate.latitude.toString(),
      longitude: coordinate.longitude.toString(),
      current: 'temperature_2m',
      daily: 'temperature_2m_min,temperature_2m_max',
      forecast_days: env.weatherForecastDays.toString(),
      timezone: env.weatherTimezone,
    })

    const response = await fetch(`${env.openMeteoApiUrl}?${params.toString()}`)

    if (!response.ok) {
      throw new WeatherServiceError(
        `Failed to fetch weather data: ${response.statusText}`,
        response.status,
      )
    }

    const data = (await response.json()) as OpenMeteoResponse

    if (data.current?.temperature_2m === undefined) {
      throw new WeatherServiceError('Invalid weather data received')
    }

    const current: CurrentWeather = {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      unit: '°C',
    }

    const forecast: DailyForecast[] = data.daily.time.map((time, index) => ({
      date: time,
      temperatureMin: data.daily.temperature_2m_min[index]!,
      temperatureMax: data.daily.temperature_2m_max[index]!,
      unit: '°C',
    }))

    return { current, forecast }
  }
}
