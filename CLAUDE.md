# Lil Tracker

Self-hosted personal finance tracker for managing incomes and expenses.

## Tech Stack

- **Frontend:** Vue 3 + TypeScript + Vite, Tailwind CSS, Reka UI, Pinia (state), Vue Router, served via Nginx
- **Backend:** Bun + Fastify 5 + Prisma 6 ORM
- **Database:** SQLite (file-based)
- **Deployment:** Docker Compose

## Architecture

```
User → Nginx (port 3000) → Vue SPA
                          → /api/* proxied to Fastify backend (port 31000)
                                                → SQLite (./data/)
```

Backend port is not exposed externally — only accessible through the Nginx proxy.

## Project Structure

```
├── backend/              # Bun + Fastify API
│   ├── src/
│   │   ├── index.ts      # Fastify server entry point
│   │   └── routes/       # API route handlers
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   ├── seed.ts       # Admin user seeding
│   │   └── migrations/   # SQL migrations
│   ├── entrypoint.sh     # Docker entrypoint (migrate + seed + start)
│   └── Dockerfile
├── frontend/             # Vue 3 SPA
│   ├── src/
│   │   ├── views/        # Page components (HomeView, FormView, CategoryView, LoginView)
│   │   ├── components/   # Reusable UI components
│   │   ├── stores/       # Pinia stores (auth, transactions, categories)
│   │   ├── router/       # Vue Router config with auth guards
│   │   └── lib/          # Utilities
│   ├── nginx.conf        # Nginx config for SPA + API proxy
│   └── Dockerfile
├── utils/                # backup.sh, restore.sh
├── docker-compose.yml
└── .env.example
```

## Database Schema

Three models in SQLite via Prisma:

- **User** — id, username (unique), password (bcrypt hashed), timestamps, soft delete
- **Category** — id, name, relation to transactions, timestamps, soft delete
- **Transaction** — id, amount (float), date, time, description, kind (`income`|`expense`), optional categoryId, timestamps, soft delete

All models use soft deletes (`deletedAt` field).

## API Endpoints

- `POST /login` — authenticate
- `GET|POST /transactions` — list / create
- `GET|PUT|DELETE /transactions/:id` — read / update / soft-delete
- `GET|POST /categories` — list / create
- `GET|PUT|DELETE /categories/:id` — read / update / soft-delete

## Build/Lint/Test Commands

### Backend (from `backend/`)

- **Install:** `bun install`
- **Dev server:** `bun run dev` (runs `src/server.ts --watch`)
- **Start:** `bun run start`
- **Prisma generate:** `bun run prisma:generate`
- **Prisma seed:** `bun run prisma:seed`
- **Migrations:** `bunx prisma migrate deploy`
- **New migration:** `bunx prisma migrate dev --name <name>`

### Frontend (from `frontend/`)

- **Install:** `npm install`
- **Dev server:** `npm run dev` (Vite)
- **Build:** `npm run build` (vue-tsc + vite build)
- **Lint:** `npm run lint`
- **Lint fix:** `npm run lint:fix`
- **Format:** `npm run format` (Prettier on `src/`)
- **Typecheck:** `npm run build` (vue-tsc runs as part of build)

### Docker

- **Run everything:** `docker compose up --build`
- **Rebuild single service:** `docker compose up --build backend` or `frontend`

### Before Committing

Run lint and typecheck; verify with `git status` and `git diff`.

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite connection string (e.g. `file:/app/prisma/dev.db`) |
| `DEFAULT_ADMIN_PASSWORD` | Password for seeded admin user |
| `VITE_API_URL` | Backend URL for frontend dev (e.g. `http://localhost:31000`) |

## Code Style Guidelines

Follow existing patterns in the codebase. Use linters to enforce styles. Mimic styles from
surrounding code when editing.

### General Principles

- **Consistency**: Match the style of the file you're editing.
- **Security**: Never log or expose secrets; use environment variables.
- **Error Handling**: Use try-catch for async operations; display user-friendly messages via vue-sonner toasts.
- **Comments**: Add only when necessary; prefer self-documenting code. No comments unless requested.

### TypeScript (Backend)

- **Runtime:** Bun — use Bun APIs where appropriate.
- **Strict mode** enabled; `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess` on.
- **Path aliases:** `@routes/*` → `src/routes/*`, `@plugins/*` → `src/plugins/*`.
- **Naming:** camelCase for variables/functions, PascalCase for types/interfaces, UPPER_SNAKE_CASE for constants.
- **Imports:** ES modules (`import`/`export`). Use path aliases.

### Vue / TypeScript (Frontend)

- **ESLint:** vue3-essential + recommended + TypeScript + Prettier integration.
- **Strict mode** enabled; `noUnusedLocals`, `noUnusedParameters` on.
- **Path alias:** `@/*` → `src/*`.
- **Naming:** camelCase for variables/functions, PascalCase for components (e.g. `UserProfile.vue`), UPPER_SNAKE_CASE for constants.
- **Imports:** ES modules. Use `@/` alias. Remove unused imports.
- **Types:** Use TypeScript everywhere. No implicit `any`. Define interfaces for data shapes. Use `defineProps<{ ... }>()` for prop types.
- **Vue conventions:**
  - Composition API with `<script setup>`.
  - Single-file components (`.vue`).
  - Reactivity utilities from `@vueuse/core`.
  - Styling via Tailwind classes; no inline styles unless necessary.
  - Keep components small and reusable.

## Notes

- Currency formatting uses Euro (€).
- UI has some Italian language strings.
- Route guard redirects unauthenticated users to `/login`.
- Default admin credentials: username `admin`, password from env variable.

## Guidelines for Agents

- Only commit when explicitly asked; run lint/typecheck after changes.
- After edits, run appropriate lint/test commands to verify.
- Prefer editing existing files; create new files only if required.
- Check `package.json` / dependencies before adding new packages.
- Use `file_path:line_number` format for code references.
