import type { WeatherDetails } from './weather-details.types.js'

export interface Coordinate {
  latitude: number
  longitude: number
}

export interface CurrentWeather {
  time: string
  temperature: number
  apparentTemperature: number
  weatherCode: number
  unit: '°C'
}

export interface DailyForecast {
  date: string
  temperatureMin: number
  temperatureMax: number
  weatherCode: number
  unit: '°C'
}

export interface WeatherResponse {
  city: string
  state: string
  current: CurrentWeather
  forecast: DailyForecast[]
  details: WeatherDetails
  hourly: { time: string; temperature: number }[]
}
