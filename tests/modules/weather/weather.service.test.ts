import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WeatherService } from '../../../src/modules/weather/weather.service.js'
import { WeatherServiceError } from '../../../src/modules/weather/weather.errors.js'
import { env } from '../../../src/shared/config/env.js'
import { cache } from '../../../src/shared/utils/cache.js'

describe('WeatherService', () => {
  let service: WeatherService

  const mockCoordinate = { latitude: -9.97, longitude: -67.82 }
  const mockApiResponse = {
    current: {
      time: '2026-05-05T14:30',
      temperature_2m: 32.5,
      apparent_temperature: 35.2,
      relative_humidity_2m: 65,
      weathercode: 0,
      wind_speed_10m: 12,
      wind_direction_10m: 180,
      surface_pressure: 1013,
    },
    daily: {
      time: ['2027-01-01', '2027-01-02', '2027-01-03'],
      temperature_2m_min: [22, 21, 23],
      temperature_2m_max: [34, 33, 35],
      weathercode: [0, 1, 3],
      sunrise: ['2027-01-01T06:00', '2027-01-02T06:01', '2027-01-03T06:02'],
      sunset: ['2027-01-01T18:00', '2027-01-02T18:00', '2027-01-03T18:00'],
    },
    hourly: {
      time: Array.from({ length: 24 }, (_, i) => `2026-05-05T${i.toString().padStart(2, '0')}:00`),
      temperature_2m: Array.from({ length: 24 }, (_, i) => 20 + i * 0.5),
      uv_index: Array.from({ length: 24 }, (_, i) => Math.max(0, 10 - i)),
    },
  }

  beforeEach(() => {
    service = new WeatherService()
    cache.clear()
    vi.restoreAllMocks()
  })

  it('should return current weather and forecast on success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    } as Response)

    const result = await service.getCurrentWeather(mockCoordinate)

    expect(result.current).toEqual({
      time: '2026-05-05T14:30',
      temperature: 32.5,
      apparentTemperature: 35.2,
      weatherCode: 0,
      unit: '°C',
    })
    expect(result.forecast).toHaveLength(3)
    expect(result.forecast[0]).toEqual({
      date: '2027-01-01',
      temperatureMin: 22,
      temperatureMax: 34,
      weatherCode: 0,
      unit: '°C',
    })
    expect(result.details).toEqual({
      humidity: 65,
      windSpeed: 12,
      windDirection: 180,
      uvIndex: expect.any(Number),
      sunrise: '2027-01-01T06:00',
      sunset: '2027-01-01T18:00',
      apparentTemperature: 35.2,
      pressure: 1013,
    })
    expect(result.hourly).toBeDefined()
    expect(Array.isArray(result.hourly)).toBe(true)
  })

  it('should return cached data on subsequent calls', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    } as Response)

    await service.getCurrentWeather(mockCoordinate)
    await service.getCurrentWeather(mockCoordinate)

    expect(fetchSpy).toHaveBeenCalledTimes(1)
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
      current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weathercode,wind_speed_10m,wind_direction_10m,surface_pressure',
      daily: 'temperature_2m_min,temperature_2m_max,weathercode,sunrise,sunset',
      hourly: 'temperature_2m,uv_index',
      forecast_days: env.weatherForecastDays.toString(),
      timezone: env.weatherTimezone,
    })

    expect(fetchSpy).toHaveBeenCalledWith(`${env.openMeteoApiUrl}?${expectedParams.toString()}`)
  })
})
