# --- Base stage ---
FROM node:22.18.0-alpine AS base
WORKDIR /app

# Copy the entire workspace with pre-built node_modules and libs
COPY . .

# --- Build stage (only build the specific microservice) ---
FROM base AS build
WORKDIR /app/microservices/document-service

# Build only this microservice since libs are already built
RUN npm run build

# --- Production stage ---
FROM node:22.18.0-alpine AS production
WORKDIR /app

# Copy the pre-installed node_modules from base
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-lock.yaml ./

# Copy all built libraries (already built in pipeline)
COPY --from=base /app/libs ./libs

# Copy the built microservice
COPY --from=build /app/microservices/document-service/dist ./dist
COPY --from=build /app/microservices/document-service/package.json ./microservices/document-service/

# Port managed by ingress, no EXPOSE needed
CMD ["node", "dist/main.js"]
