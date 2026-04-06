FROM node:20-alpine AS base

ARG APP
ENV APP=$APP

FROM base AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN apk add --no-cache python3 make g++

RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build:$APP

FROM base AS runner
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

CMD node dist/apps/${APP}/apps/${APP}/src/main.js