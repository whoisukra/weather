import { GeocodingError } from './geocoding.errors.js'
import { type GeocodingResponse } from './geocoding.types.js'

export class GeocodingService {
  private readonly apiUrl = 'https://geocoding-api.open-meteo.com/v1/search'

  async searchCity(query: string): Promise<GeocodingResponse> {
    const params = new URLSearchParams({
      name: query,
      count: '5',
      language: 'pt',
      format: 'json',
    })

    const response = await fetch(`${this.apiUrl}?${params.toString()}`)

    if (!response.ok) {
      throw new GeocodingError(
        `Failed to search city: ${response.statusText}`,
        response.status,
      )
    }

    const data = await response.json() as { results?: Array<{ name: string; admin1?: string; country?: string; latitude: number; longitude: number }> }

    if (!data.results || data.results.length === 0) {
      throw new GeocodingError('City not found', 404)
    }

    return {
      results: data.results.map((r) => ({
        name: r.name,
        state: r.admin1 || '',
        country: r.country || '',
        latitude: r.latitude,
        longitude: r.longitude,
      })),
    }
  }
}
