import { describe, expect, it, vi } from 'vitest'
import { WeatherController } from '../../../src/modules/weather/weather.controller.js'

describe('WeatherController', () => {
  const mockWeatherService = {
    getCurrentWeather: vi.fn(),
  }

  const controller = new WeatherController(mockWeatherService as any)

  const mockServiceResponse = {
    current: { time: '2026-05-05T14:30', temperature: 32.5, apparentTemperature: 35.2, weatherCode: 0, unit: '°C' as const },
    forecast: [
      { date: '2026-05-05', temperatureMin: 22, temperatureMax: 34, weatherCode: 0, unit: '°C' as const },
    ],
    details: {
      humidity: 65,
      windSpeed: 12,
      windDirection: 180,
      uvIndex: 5.5,
      sunrise: '2026-05-05T06:00',
      sunset: '2026-05-05T18:00',
      apparentTemperature: 35.2,
      pressure: 1013,
    },
    hourly: [{ time: '2026-05-05T14:00', temperature: 30 }],
    city: '',
    state: '',
  }

  it('should return formatted weather response with default location', async () => {
    mockWeatherService.getCurrentWeather.mockResolvedValue(mockServiceResponse)

    const result = await controller.handle({ query: {} } as any)

    expect(result).toEqual({
      city: 'Rio Branco',
      state: 'AC',
      current: { time: '2026-05-05T14:30', temperature: 32.5, apparentTemperature: 35.2, weatherCode: 0, unit: '°C' },
      forecast: [
        { date: '2026-05-05', temperatureMin: 22, temperatureMax: 34, weatherCode: 0, unit: '°C' },
      ],
      details: mockServiceResponse.details,
      hourly: mockServiceResponse.hourly,
    })

    expect(mockWeatherService.getCurrentWeather).toHaveBeenCalledWith({
      latitude: -9.97,
      longitude: -67.82,
    })
  })

  it('should use custom coordinates when provided', async () => {
    mockWeatherService.getCurrentWeather.mockResolvedValue(mockServiceResponse)

    await controller.handle({
      query: { lat: '-23.55', long: '-46.63', city: 'São Paulo', state: 'SP' },
    } as any)

    expect(mockWeatherService.getCurrentWeather).toHaveBeenCalledWith({
      latitude: -23.55,
      longitude: -46.63,
    })
  })

  it('should propagate service errors', async () => {
    const testError = new Error('Service error')
    mockWeatherService.getCurrentWeather.mockRejectedValue(testError)

    await expect(controller.handle({ query: {} } as any)).rejects.toThrow(testError)
  })
})
