export class WeatherServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 502,
  ) {
    super(message)
    this.name = 'WeatherServiceError'
  }
}
