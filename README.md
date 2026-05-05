# oc-sample

Fastify weather API with Vue 3 frontend. Monorepo with backend and frontend serving weather data using the Open-Meteo API.

## Requirements

- Node.js >= 18
- npm or your preferred package manager

## Getting Started

1. Clone and install dependencies:

```bash
npm install
cd front && npm install && cd ..
```

2. Set up environment variables:

```bash
cp .env.example .env
```

3. Run both frontend and backend:

```bash
npm run dev
```

- **Frontend:** `http://localhost:5173` (Vite)
- **Backend API:** `http://localhost:3000` (Fastify)

## Available Scripts

| Script                 | Description                           |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Run frontend and backend concurrently |
| `npm run dev:server`   | Backend only with hot reload          |
| `npm run dev:web`      | Frontend only (Vite)                  |
| `npm run build`        | Build both frontend and backend       |
| `npm run build:server` | Compile TypeScript to `dist/`         |
| `npm run build:web`    | Build frontend to `front/dist/`       |
| `npm start`            | Run production build                  |
| `npm run typecheck`    | Type-check both projects              |
| `npm test`             | Run backend tests                     |
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
├── src/                          # Backend (Fastify)
│   ├── index.ts                  # Entry point
│   ├── shared/                   # Shared utilities
│   │   ├── config/env.ts
│   │   └── http/error-handler.ts
│   └── modules/
│       └── weather/
│           ├── weather.routes.ts
│           ├── weather.controller.ts
│           ├── weather.service.ts
│           ├── weather.types.ts
│           └── weather.errors.ts
│
├── front/                        # Frontend (Vue 3 + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   │   ├── WeatherCard.vue
│   │   │   └── ForecastRow.vue
│   │   ├── composables/
│   │   │   └── useWeather.ts
│   │   ├── types/
│   │   │   └── weather.ts
│   │   ├── App.vue
│   │   ├── main.ts
│   │   └── index.css
│   └── index.html
│
├── tests/                        # Backend tests
│   ├── helper.ts
│   └── modules/weather/
│
├── package.json                  # Root package (orchestration)
└── README.md
```

## Architecture

Monorepo with feature-based backend and Vue 3 frontend. The backend serves a REST API while the frontend consumes it via Vite dev proxy (`/api` → `http://localhost:3000`).

## License

ISC
