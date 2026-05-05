import 'dotenv/config'

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  openMeteoApiUrl: process.env.OPEN_METEO_API_URL || 'https://api.open-meteo.com/v1/forecast',
  weatherCity: process.env.WEATHER_CITY || 'Rio Branco',
  weatherState: process.env.WEATHER_STATE || 'AC',
  weatherLatitude: Number(process.env.WEATHER_LATITUDE) || -9.97,
  weatherLongitude: Number(process.env.WEATHER_LONGITUDE) || -67.82,
  weatherForecastDays: Number(process.env.WEATHER_FORECAST_DAYS) || 3,
  weatherTimezone: process.env.WEATHER_TIMEZONE || 'America/Rio_Branco',
}
