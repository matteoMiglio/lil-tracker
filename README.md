# 💸 Lil Tracker

**Lil Tracker** is a lightweight, self-hosted web application that helps you effortlessly track your incomes and expenses. Simple, clean, and made to get out of your way while giving you full control over your personal finances.

## ✨ Features

- 📊 Track **incomes** and **expenses** in a clean, intuitive UI
- 🏷️ Organize transactions with **custom categories**
- ⚡ Fast, lightweight, and Dockerized
- 🗃️ **SQLite** for easy data persistence with zero setup
- 🔐 Backend is only accessible internally through the frontend

## 📂 Project Structure

```text
lil-tracker/
├── backend/        ← Bun + Prisma + SQLite API
├── frontend/       ← Vue.js + Tailwind UI served via Nginx
├── docker-compose.yml
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/lil-tracker.git
cd lil-tracker
```

### 2. Start the application

Use Docker Compose to spin up both frontend and backend:

```bash
docker compose up -d --build
```

This will:

- Build and run the Bun-powered backend
- Build the Vue + Nginx frontend
- Automatically create the SQLite database with the latest schema

### 3. Access the app

Once everything is up, open your browser at:

```text
http://localhost:8080
```

## 🛠️ Development

### Prerequisites

- `Docker`
- `Docker Compose`

### Local development

If you want to develop locally without Docker:

1. Backend

```bash
cd backend
bun install
bun run dev
```

2. Frontend

```bash
cd frontend
bun install
bun run dev
```

You may need to update the API URL in the frontend to point to your local backend server.

## ⚙️ Environment Variables

The backend uses a `.env` file to configure the database:

`DATABASE_URL="file:./prisma/database/dev.db"`

This is handled automatically by Docker Compose. For custom setups, ensure this path points to your SQLite file.
