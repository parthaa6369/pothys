# --- Base stage ---
FROM node:22.18.0-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./

# Copy code
COPY libs ./libs
COPY microservices/identity-service ./microservices/identity-service


# Install deps
# RUN pnpm install --frozen-lockfile

RUN pnpm install
# Build all local libraries before installing dependencies
RUN pnpm --filter ./libs run build:all

# --- Dev stage ---
FROM base AS dev
WORKDIR /app/microservices/identity-service

# Install nodemon for reload
RUN pnpm add -D nodemon

# Start TypeScript watch + nodemon
CMD sh -c "pnpm run start:dev"

# --- Build stage ---
FROM base AS build
WORKDIR /app/microservices/identity-service
RUN pnpm run build

# --- Production stage ---
FROM node:22.18.0-alpine AS production
WORKDIR /app
RUN npm install -g pnpm


# Copy node_modules and workspace files
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-lock.yaml ./

# Copy built dist of all libraries for @asb/* packages
COPY --from=build /app/libs ./libs
COPY --from=build /app/microservices/identity-service/dist ./dist

EXPOSE 3001
CMD ["node", "dist/main.js"]
