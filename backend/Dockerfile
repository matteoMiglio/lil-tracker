# Build stage
FROM oven/bun:1.2.6-slim AS build

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .

# Production stage
FROM oven/bun:1.2.6-slim AS production

WORKDIR /app
COPY --from=build /app /app

EXPOSE 31000

COPY entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

CMD ["bun", "run", "start"]