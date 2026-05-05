FROM node:24-alpine AS base
RUN apk add --no-cache dumb-init
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY front/package.json front/package-lock.json front/package.json front/
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/front/node_modules ./front/node_modules
COPY . .
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/front/dist ./front/dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/front/dist ./public

EXPOSE 3000
CMD ["dumb-init", "node", "dist/index.js"]
