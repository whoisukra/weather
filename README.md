# Gray Weather

Previsão do tempo elegante e moderna com Fastify + Vue 3 + Tailwind CSS.

## Demo

[Assista ao vídeo de demonstração (490KB)](media/app-demo-video-compressed.mp4)

> Gray Weather em ação: busca de cidades, clima em tempo real, gráficos e modo escuro/claro.

## Features

- Busca por cidade com modal e geolocalização
- Condições climáticas (WMO codes) com ícones SVG
- Detalhes: umidade, vento, UV, pressão, nascer/pôr do sol, sensação térmica
- Gráfico de tendência de temperatura (12h)
- Toggle °C/°F com persistência
- Histórico de cidades recentes (localStorage)
- Dark/Light mode com glassmorphism
- PWA (instalável + cache offline)
- Rate limiting (100 req/min) e cache no backend (15min)
- Health check endpoint

## Requirements

- Node.js >= 22
- npm

## Getting Started

1. Clone e instale as dependências:

```bash
npm install
cd front && npm install && cd ..
```

2. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

3. Rode o projeto:

```bash
npm run dev
```

- **Frontend:** `http://localhost:5173` (Vite)
- **Backend API:** `http://localhost:3000` (Fastify)

## Available Scripts

### Root

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Frontend + backend em dev |
| `npm run dev:server` | Backend com hot reload |
| `npm run dev:web` | Frontend (Vite) |
| `npm run build` | Build de ambos |
| `npm start` | Produção (single process) |
| `npm run typecheck` | Type-check |
| `npm test` | Testes |
| `npm run lint` | ESLint no frontend |
| `npm run format` | Prettier no frontend |

## API Endpoints

### GET /weather

Retorna temperatura atual, previsão 3 dias e detalhes meteorológicos.

**Response:**

```json
{
  "city": "São Paulo",
  "state": "SP",
  "current": {
    "time": "2026-05-05T14:30",
    "temperature": 32.5,
    "apparentTemperature": 35.2,
    "weatherCode": 0,
    "unit": "°C"
  },
  "forecast": [
    {
      "date": "2026-05-05",
      "temperatureMin": 22,
      "temperatureMax": 34,
      "weatherCode": 0,
      "unit": "°C"
    }
  ],
  "details": {
    "humidity": 65,
    "windSpeed": 12,
    "windDirection": 180,
    "uvIndex": 5.5,
    "sunrise": "2026-05-05T06:00",
    "sunset": "2026-05-05T18:00",
    "apparentTemperature": 35.2,
    "pressure": 1013
  },
  "hourly": [
    { "time": "2026-05-05T14:00", "temperature": 30 }
  ]
}
```

### GET /health

Health check para monitoramento.

**Response:**

```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2026-05-05T14:30:00.000Z"
}
```

## Environment Variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `PORT` | `3000` | Porta do servidor |
| `NODE_ENV` | `development` | Ambiente |
| `OPEN_METEO_API_URL` | `https://api.open-meteo.com/v1/forecast` | Endpoint da API |
| `WEATHER_CITY` | `Rio Branco` | Cidade padrão |
| `WEATHER_STATE` | `AC` | Estado padrão |
| `WEATHER_LATITUDE` | `-9.97` | Latitude padrão |
| `WEATHER_LONGITUDE` | `-67.82` | Longitude padrão |
| `WEATHER_FORECAST_DAYS` | `3` | Dias de previsão |
| `WEATHER_TIMEZONE` | `America/Rio_Branco` | Timezone |

## Project Structure

```
├── src/                              # Backend (Fastify)
│   ├── index.ts                      # Entry point + static files
│   ├── shared/
│   │   ├── config/env.ts
│   │   ├── http/error-handler.ts
│   │   └── utils/cache.ts            # Cache in-memory
│   └── modules/
│       ├── health/health.routes.ts   # Health check
│       ├── weather/
│       └── geocoding/
│
├── front/                            # Frontend (Vue 3 + Tailwind + PWA)
│   ├── src/
│   │   ├── components/
│   │   │   ├── WeatherCard.vue
│   │   │   ├── WeatherDetails.vue
│   │   │   ├── ForecastRow.vue
│   │   │   ├── TemperatureChart.vue
│   │   │   ├── CitySearch.vue
│   │   │   ├── ThemeToggle.vue
│   │   │   └── UnitToggle.vue
│   │   ├── composables/
│   │   │   ├── useWeather.ts
│   │   │   ├── useGeocoding.ts
│   │   │   ├── useUnit.ts
│   │   │   └── useHistory.ts
│   │   ├── types/weather.ts
│   │   ├── utils/weatherCode.ts
│   │   └── App.vue
│   └── vite.config.ts                # Com vite-plugin-pwa
│
├── tests/                            # Backend tests (Vitest)
├── weather-docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .dockerignore
└── README.md
```

## Docker

Todos os arquivos Docker estão em `weather-docker/`:

```bash
cd weather-docker
docker compose up -d
```

O container roda backend + frontend estático na porta 3000.

Health check: `http://localhost:3000/health`

## Architecture

Monorepo com backend feature-based e frontend Vue 3. Em produção, o Fastify serve o frontend estático via `@fastify/static` (single process).

## License

ISC
