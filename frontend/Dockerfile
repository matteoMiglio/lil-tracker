# Build Stage
FROM node:22.9 AS build-stage

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile

COPY . .

RUN npm run build-only

# Production Stage
FROM nginx:latest AS production-stage

# Copy built files to the standard Nginx directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]