export interface CurrentWeather {
  time: string
  temperature: number
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
}
