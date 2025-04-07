# Build stage
FROM oven/bun:1.2.6-slim AS build

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .

# Production stage
FROM oven/bun:1.2.6-slim AS production

WORKDIR /app
COPY --from=build /app /app

# Expose the port and start the app
EXPOSE 31000
CMD ["bun", "run", "start"]