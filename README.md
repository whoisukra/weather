# oc-sample

Fastify weather API that provides current temperature and forecasts using the Open-Meteo API.

## Requirements

- Node.js >= 18
- npm or your preferred package manager

## Getting Started

1. Clone and install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

3. Run the development server:

```bash
npm run dev
```

The server will be available at `http://localhost:3000`.

## Available Scripts

| Script                 | Description                           |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Dev server with hot reload            |
| `npm run build`        | Compile TypeScript to `dist/`         |
| `npm start`            | Run production build                  |
| `npm run typecheck`    | Type-check without emitting           |
| `npm test`             | Run all tests                         |
| `npm run test:watch`   | Run tests in watch mode               |
| `npm run test:coverage`| Run tests with coverage report        |

## API Endpoints

### GET /weather

Returns current temperature and 3-day forecast for Rio Branco, AC.

**Response:**

```json
{
  "city": "Rio Branco",
  "state": "AC",
  "current": {
    "time": "2026-05-05T14:30",
    "temperature": 32.5,
    "unit": "°C"
  },
  "forecast": [
    {
      "date": "2026-05-05",
      "temperatureMin": 22,
      "temperatureMax": 34,
      "unit": "°C"
    }
  ]
}
```

**Error responses:**

- `400` - Validation error
- `500` - Internal server error
- `502` - Weather service unavailable

## Environment Variables

| Variable                 | Default                                      | Description                        |
| ------------------------ | -------------------------------------------- | ---------------------------------- |
| `PORT`                   | `3000`                                       | Server port                        |
| `NODE_ENV`               | `development`                                | Environment (development/production)|
| `OPEN_METEO_API_URL`     | `https://api.open-meteo.com/v1/forecast`     | Open-Meteo API endpoint            |
| `WEATHER_CITY`           | `Rio Branco`                                 | City name                          |
| `WEATHER_STATE`          | `AC`                                         | State abbreviation                 |
| `WEATHER_LATITUDE`       | `-9.97`                                      | Location latitude                  |
| `WEATHER_LONGITUDE`      | `-67.82`                                     | Location longitude                 |
| `WEATHER_FORECAST_DAYS`  | `3`                                          | Number of forecast days            |
| `WEATHER_TIMEZONE`       | `America/Rio_Branco`                         | Timezone for the location          |

## Project Structure

```
src/
├── index.ts                          # Entry point, graceful shutdown
├── shared/
│   ├── config/env.ts                 # Environment variables
│   └── http/error-handler.ts         # Global error handler
└── modules/
    └── weather/
        ├── weather.routes.ts         # Route registration with JSON Schema
        ├── weather.controller.ts     # Request handling
        ├── weather.service.ts        # Business logic & API calls
        ├── weather.types.ts          # TypeScript interfaces
        └── weather.errors.ts         # Custom errors

tests/
├── helper.ts                         # Fastify app factory for tests
└── modules/
    └── weather/
        ├── weather.service.test.ts   # Service unit tests
        ├── weather.controller.test.ts# Controller unit tests
        └── weather.routes.test.ts    # Integration tests
```

## Architecture

Feature-based modular architecture. Each module in `src/modules/` is self-contained with its own routes, controller, service, types, and errors. Shared utilities live in `src/shared/`.

## License

ISC
