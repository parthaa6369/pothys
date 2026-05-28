# --- Base stage ---
FROM node:22.18.0-alpine AS base
WORKDIR /app

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

# Copy the entire workspace with pre-built node_modules and libs
COPY . .

# --- Build stage (only build the specific microservice) ---
FROM base AS build
WORKDIR /app/microservices/diffusion-service

# Build only this microservice since libs are already built (this will copy templates via nest-cli.json)
RUN npm run build

# --- Production stage ---
FROM node:22.18.0-alpine AS production
WORKDIR /app

# Install Chromium for Puppeteer in production stage
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

# Copy the pre-installed node_modules from base
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-lock.yaml ./

# Copy all built libraries (already built in pipeline)
COPY --from=base /app/libs ./libs

# Copy the built microservice
COPY --from=build /app/microservices/diffusion-service/dist ./dist
COPY --from=build /app/microservices/diffusion-service/package.json ./microservices/diffusion-service/

# Port managed by ingress, no EXPOSE needed
CMD ["node", "dist/main.js"]
