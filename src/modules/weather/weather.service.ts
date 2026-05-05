import { env } from '../../shared/config/env.js'
import { cache } from '../../shared/utils/cache.js'
import { WeatherServiceError } from './weather.errors.js'
import { type Coordinate, type CurrentWeather, type DailyForecast, type WeatherResponse } from './weather.types.js'
import type { WeatherDetails } from './weather-details.types.js'

interface OpenMeteoResponse {
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    weathercode: number
    wind_speed_10m: number
    wind_direction_10m: number
    surface_pressure: number
  }
  daily: {
    time: string[]
    temperature_2m_min: number[]
    temperature_2m_max: number[]
    weathercode: number[]
    sunrise: string[]
    sunset: string[]
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    uv_index: number[]
  }
}

const CACHE_TTL_MS = 15 * 60 * 1000

export class WeatherService {
  private getCacheKey(coordinate: Coordinate): string {
    return `weather:${coordinate.latitude.toFixed(4)},${coordinate.longitude.toFixed(4)}`
  }

  async getCurrentWeather(coordinate: Coordinate): Promise<WeatherResponse> {
    const cacheKey = this.getCacheKey(coordinate)
    const cached = cache.get<WeatherResponse>(cacheKey)
    if (cached) return cached

    const params = new URLSearchParams({
      latitude: coordinate.latitude.toString(),
      longitude: coordinate.longitude.toString(),
      current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weathercode,wind_speed_10m,wind_direction_10m,surface_pressure',
      daily: 'temperature_2m_min,temperature_2m_max,weathercode,sunrise,sunset',
      hourly: 'temperature_2m,uv_index',
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
      apparentTemperature: data.current.apparent_temperature,
      weatherCode: data.current.weathercode,
      unit: '°C',
    }

    const today = new Date().toISOString().split('T')[0]!

    const forecast: DailyForecast[] = data.daily.time
      .map((time, index) => ({
        date: time,
        temperatureMin: data.daily.temperature_2m_min[index]!,
        temperatureMax: data.daily.temperature_2m_max[index]!,
        weatherCode: data.daily.weathercode[index]!,
        unit: '°C' as const,
      }))
      .filter((day) => day.date >= today)
      .slice(0, env.weatherForecastDays)

    const nowHourIndex = data.hourly.time.findIndex((t) => t >= new Date().toISOString().slice(0, 13))
    const uvIndex = nowHourIndex >= 0 ? (data.hourly.uv_index[nowHourIndex] ?? 0) : 0

    const details: WeatherDetails = {
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      uvIndex,
      sunrise: data.daily.sunrise[0] || '',
      sunset: data.daily.sunset[0] || '',
      apparentTemperature: data.current.apparent_temperature,
      pressure: data.current.surface_pressure,
    }

    const hourlyStart = Math.max(0, nowHourIndex)
    const hourly = data.hourly.time
      .slice(hourlyStart, hourlyStart + 24)
      .map((time, i) => ({
        time,
        temperature: data.hourly.temperature_2m[hourlyStart + i]!,
      }))

    const result: WeatherResponse = {
      city: '',
      state: '',
      current,
      forecast,
      details,
      hourly,
    }

    cache.set(cacheKey, result, CACHE_TTL_MS)
    return result
  }
}
