import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WeatherService } from '../../../src/modules/weather/weather.service.js'
import { WeatherServiceError } from '../../../src/modules/weather/weather.errors.js'
import { env } from '../../../src/shared/config/env.js'

describe('WeatherService', () => {
  let service: WeatherService

  const mockCoordinate = { latitude: -9.97, longitude: -67.82 }
  const mockApiResponse = {
    current: { time: '2026-05-05T14:30', temperature_2m: 32.5 },
    daily: {
      time: ['2026-05-05', '2026-05-06', '2026-05-07'],
      temperature_2m_min: [22, 21, 23],
      temperature_2m_max: [34, 33, 35],
    },
  }

  beforeEach(() => {
    service = new WeatherService()
    vi.restoreAllMocks()
  })

  it('should return current weather and forecast on success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    } as Response)

    const result = await service.getCurrentWeather(mockCoordinate)

    expect(result).toEqual({
      current: { time: '2026-05-05T14:30', temperature: 32.5, unit: '°C' },
      forecast: [
        { date: '2026-05-05', temperatureMin: 22, temperatureMax: 34, unit: '°C' },
        { date: '2026-05-06', temperatureMin: 21, temperatureMax: 33, unit: '°C' },
        { date: '2026-05-07', temperatureMin: 23, temperatureMax: 35, unit: '°C' },
      ],
    })
  })

  it('should throw WeatherServiceError when API response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response)

    await expect(service.getCurrentWeather(mockCoordinate)).rejects.toThrow(WeatherServiceError)
    await expect(service.getCurrentWeather(mockCoordinate)).rejects.toThrow(
      'Failed to fetch weather data: Internal Server Error',
    )
  })

  it('should throw WeatherServiceError when response data is invalid', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ current: undefined }),
    } as Response)

    await expect(service.getCurrentWeather(mockCoordinate)).rejects.toThrow(WeatherServiceError)
    await expect(service.getCurrentWeather(mockCoordinate)).rejects.toThrow(
      'Invalid weather data received',
    )
  })

  it('should use correct API URL and parameters', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    } as Response)

    await service.getCurrentWeather(mockCoordinate)

    const expectedParams = new URLSearchParams({
      latitude: mockCoordinate.latitude.toString(),
      longitude: mockCoordinate.longitude.toString(),
      current: 'temperature_2m',
      daily: 'temperature_2m_min,temperature_2m_max',
      forecast_days: env.weatherForecastDays.toString(),
      timezone: env.weatherTimezone,
    })

    expect(fetchSpy).toHaveBeenCalledWith(`${env.openMeteoApiUrl}?${expectedParams.toString()}`)
  })
})
