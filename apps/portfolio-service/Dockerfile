# --- Base stage ---
FROM node:22.18.0-alpine AS base
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Install Chromium and required dependencies for Puppeteer
RUN apk update && apk add --no-cache \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  ttf-dejavu \
  libstdc++ \
  wqy-zenhei \
  bash \
  udev \
  mesa-gl

# Tell Puppeteer to skip downloading Chromium (we installed it via apk)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV CHROMIUM_PATH=/usr/bin/chromium-browser

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./

# Copy source code and libs
COPY libs ./libs
COPY microservices/diffusion-service ./microservices/diffusion-service

# Install deps
RUN pnpm install

# Build shared libs
RUN pnpm --filter ./libs run build:all


# --- Build stage ---
FROM node:22.18.0-alpine AS dev
WORKDIR /app

RUN npm install -g pnpm

# Install Chromium for Puppeteer
RUN apk update && apk add --no-cache \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  ttf-dejavu \
  libstdc++ \
  wqy-zenhei \
  bash \
  udev \
  mesa-gl

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV CHROMIUM_PATH=/usr/bin/chromium-browser

# Copy everything from base
COPY --from=base /app /app

WORKDIR /app/microservices/diffusion-service

# Build service (with templates copied via nest-cli.json config)
CMD sh -c "pnpm run start:dev"


# --- Production stage ---
FROM node:22.18.0-alpine AS production
WORKDIR /app

RUN npm install -g pnpm

# Install Chromium for Puppeteer
RUN apk update && apk add --no-cache \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  ttf-dejavu \
  libstdc++ \
  wqy-zenhei \
  bash \
  udev \
  mesa-gl

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV CHROMIUM_PATH=/usr/bin/chromium-browser
ENV NODE_ENV=production

# Copy node modules + package files
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-lock.yaml ./

# Copy built libs + service (including templates via nest-cli.json assets)
COPY --from=build /app/libs ./libs
COPY --from=build /app/microservices/diffusion-service/dist ./dist

EXPOSE 3001
CMD ["node", "dist/main.js"]
