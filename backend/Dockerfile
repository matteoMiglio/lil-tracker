# Build stage
FROM oven/bun:1.2.6-slim AS build

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Production stage
FROM oven/bun:1.2.6-slim AS production

WORKDIR /app
COPY --from=build /app /app

CMD ["sh", "-c", "bunx prisma migrate deploy && bun run start"]

EXPOSE 31000