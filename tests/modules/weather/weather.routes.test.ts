import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildApp } from '../../helper.js'
import Fastify from 'fastify'

describe('Weather Routes', () => {
  let app: Fastify.FastifyInstance

  const mockApiResponse = {
    current: { time: '2026-05-05T14:30', temperature_2m: 32.5, weathercode: 0 },
    daily: {
      time: ['2027-01-01', '2027-01-02', '2027-01-03'],
      temperature_2m_min: [22, 21, 23],
      temperature_2m_max: [34, 33, 35],
      weathercode: [0, 1, 3],
    },
  }

  beforeEach(() => {
    app = buildApp()
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
