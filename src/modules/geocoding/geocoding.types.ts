export interface GeocodingResult {
  name: string
  state: string
  country: string
  latitude: number
  longitude: number
}

export interface GeocodingResponse {
  results: GeocodingResult[]
}
