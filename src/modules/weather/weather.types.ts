export interface Coordinate {
  latitude: number
  longitude: number
}

export interface CurrentWeather {
  time: string
  temperature: number
  unit: '°C'
}

export interface DailyForecast {
  date: string
  temperatureMin: number
  temperatureMax: number
  unit: '°C'
}

export interface WeatherResponse {
  city: string
  state: string
  current: CurrentWeather
  forecast: DailyForecast[]
}
