import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildApp } from '../../helper.js'
import Fastify from 'fastify'
import { cache } from '../../../src/shared/utils/cache.js'

describe('Weather Routes', () => {
  let app: Fastify.FastifyInstance

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
    app = buildApp()
    cache.clear()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    } as Response)
  })

  afterEach(async () => {
    await app.close()
    vi.restoreAllMocks()
  })

  it('should return 200 with weather data on GET /weather', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/weather',
    })

    expect(response.statusCode).toBe(200)

    const body = JSON.parse(response.body)
    expect(body).toHaveProperty('city', 'Rio Branco')
    expect(body).toHaveProperty('state', 'AC')
    expect(body).toHaveProperty('current')
    expect(body.current).toHaveProperty('time')
    expect(body.current).toHaveProperty('temperature', 32.5)
    expect(body.current).toHaveProperty('unit', '°C')
    expect(body).toHaveProperty('forecast')
    expect(Array.isArray(body.forecast)).toBe(true)
    expect(body.forecast).toHaveLength(3)
    expect(body).toHaveProperty('details')
    expect(body.details).toHaveProperty('humidity')
    expect(body).toHaveProperty('hourly')
    expect(Array.isArray(body.hourly)).toBe(true)
  })

  it('should return 200 on GET /health', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    })

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.body)
    expect(body).toHaveProperty('status', 'ok')
    expect(body).toHaveProperty('uptime')
    expect(body).toHaveProperty('timestamp')
  })

  it('should return 500 when service throws unexpected error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))

    const response = await app.inject({
      method: 'GET',
      url: '/weather',
    })

    expect(response.statusCode).toBe(500)

    const body = JSON.parse(response.body)
    expect(body).toHaveProperty('error', 'InternalServerError')
  })

  it('should return 404 for undefined routes', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/non-existent',
    })

    expect(response.statusCode).toBe(404)
  })
})
