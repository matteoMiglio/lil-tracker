# Lil Tracker

**Lil Tracker** is a lightweight, self-hosted web application that helps you effortlessly track your incomes and expenses. Simple, clean, and made to get out of your way while giving you full control over your personal finances.

## Features

- Track **incomes** and **expenses** in a clean, intuitive UI
- Organize transactions with **custom categories**
- Fast, lightweight, and Dockerized
- **SQLite** for easy data persistence with zero setup
- **JWT authentication** — backend routes are protected
- Backend is only accessible internally through the Nginx proxy

## Project Structure

```text
lil-tracker/
├── backend/        ← Bun + Fastify + Prisma + SQLite API
├── frontend/       ← Vue 3 + Tailwind CSS served via Nginx
├── utils/          ← Backup/restore scripts
├── docker-compose.yml
└── .env.example
```

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/matteoMiglio/lil-tracker.git
cd lil-tracker
```

### 2. Configure environment variables

Copy the example env file and edit the values:

```bash
cp .env.example .env
```

Open `.env` and set your values:

```env
DATABASE_URL=file:/app/prisma/dev.db
DEFAULT_ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-random-secret-string
```

> **Important:** Change `JWT_SECRET` to a long random string and `DEFAULT_ADMIN_PASSWORD` to a secure password.

### 3. Start the application

```bash
docker compose up -d --build
```

This will:

- Build and run the Bun-powered backend (internal port 31000, not exposed)
- Build the Vue 3 + Nginx frontend
- Automatically run database migrations, seed the admin user, and start the server

### 4. Access the app

Open your browser at:

```
http://localhost:3000
```

Log in with username `admin` and the password you set in `DEFAULT_ADMIN_PASSWORD`.

## Development

### Local development (without Docker)

#### Backend

```bash
cd backend
bun install
bunx prisma migrate deploy
bunx prisma generate
bun run dev
```

The backend runs on `http://localhost:31000`.

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs on `http://localhost:5173` and proxies API requests to the backend.

> Set `VITE_API_URL=http://localhost:31000` in your frontend environment if the default proxy doesn't work.

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | SQLite connection string | `file:/app/prisma/dev.db` |
| `DEFAULT_ADMIN_PASSWORD` | Password for the seeded admin user | `your-secure-password` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your-random-secret-string` |
| `VITE_API_URL` | Backend URL for frontend dev server | `http://localhost:31000` |

## Changing the Admin Password

To change the admin password, update `DEFAULT_ADMIN_PASSWORD` in your `.env` file and restart the containers:

```bash
docker compose down
# edit .env with the new password
docker compose up -d --build
```

On startup, the seed script detects the password mismatch and updates the stored hash automatically.

## Backup & Restore

Utility scripts are available in the `utils/` directory:

```bash
# Backup the database
./utils/backup.sh

# Restore from a backup
./utils/restore.sh <backup-file>
```
