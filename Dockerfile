FROM node:20-alpine AS base

ARG APP
ENV APP $APP

# Install dependencies
FROM base AS builder
WORKDIR /app

COPY package.json ./

# Install Python and build tools
RUN apk add --no-cache python3 make g++

RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build:$APP

# Build the final image
FROM base AS runner
WORKDIR /app

COPY --from=builder /app/dist/apps/$APP ./dist/apps/$APP
COPY --from=builder /app/node_modules ./node_modules

RUN echo "hello $APP"
RUN echo "dist/apps/$APP/apps/$APP/src/main.js"

CMD node dist/apps/${APP}/apps/${APP}/src/main.js