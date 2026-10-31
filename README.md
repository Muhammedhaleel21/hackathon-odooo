# Brightloop Subscription Management System

A unified subscription management and recurring billing platform for subscription-based businesses.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + Tailwind CSS 4 |
| Backend | NestJS 12 + REST API |
| ORM | Drizzle ORM |
| Database | Neon PostgreSQL (serverless) |
| State / Data Fetching | TanStack Query + Axios |
| Monorepo | pnpm workspaces |
| Language | TypeScript |

## Project Structure

```
brightloop/
├── web/          # Next.js frontend (port 3000)
├── api/          # NestJS backend  (port 4000)
├── packages/     # Shared packages (future)
├── package.json  # Root workspace scripts
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js ≥ 20 (managed via nvm)
- pnpm ≥ 12
- Neon PostgreSQL account (https://neon.tech)

## Installation

```bash
pnpm install
```

## Environment Setup

### Backend (`api/.env`)
```bash
cp api/.env.example api/.env
# Then fill in your real Neon DATABASE_URL
```

### Frontend (`web/.env.local`)
```bash
cp web/.env.example web/.env.local
# Already set to http://localhost:4000/api/v1
```

## Development

Run both applications concurrently:

```bash
pnpm dev
```

Or individually:

```bash
pnpm dev:web   # Next.js  → http://localhost:3000
pnpm dev:api   # NestJS   → http://localhost:4000
```

## Verification

After starting the API, verify connectivity:

```bash
# Health check (API + Database)
curl http://localhost:4000/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "api",
  "database": "connected",
  "timestamp": "..."
}
```

Then open http://localhost:3000 — the Brightloop foundation page should show **"All Systems Operational"**.

## Available Commands

| Command | Description |
|---------|------------|
| `pnpm dev` | Start both apps concurrently |
| `pnpm dev:web` | Start Next.js only |
| `pnpm dev:api` | Start NestJS only |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | TypeScript check all packages |
| `pnpm format` | Format all files with Prettier |
| `pnpm --filter api db:generate` | Generate Drizzle migrations |
| `pnpm --filter api db:migrate` | Run migrations |
| `pnpm --filter api db:studio` | Open Drizzle Studio |

## Phase Roadmap

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Project Foundation & Architecture | ✅ Complete |
| 2 | Authentication & RBAC | ✅ Complete |
| 3 | Customer Management | ✅ Complete |
| 4 | Product & Plan Management | ✅ Complete |
| 5 | Subscription Lifecycle | ✅ Complete |
| 6 | Billing & Invoicing | 🔜 Next |
| 7 | Payment Integration | — |
| 8 | Admin Dashboard | — |
| 9 | Customer Portal | — |
| 10 | Analytics & Reporting | — |
