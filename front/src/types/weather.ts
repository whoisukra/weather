export interface WeatherDetails {
  humidity: number
  windSpeed: number
  windDirection: number
  uvIndex: number
  sunrise: string
  sunset: string
  apparentTemperature: number
  pressure: number
}

export interface CurrentWeather {
  time: string
  temperature: number
  apparentTemperature: number
  weatherCode: number
  unit: '°C' | '°F'
}

export interface DailyForecast {
  date: string
  temperatureMin: number
  temperatureMax: number
  weatherCode: number
  unit: '°C' | '°F'
}

export interface HourlyForecast {
  time: string
  temperature: number
}

export interface WeatherResponse {
  city: string
  state: string
  current: CurrentWeather
  forecast: DailyForecast[]
  details: WeatherDetails
  hourly: HourlyForecast[]
}
