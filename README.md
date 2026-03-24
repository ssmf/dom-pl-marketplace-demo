# dom-pl-marketplace-demo

Headless e-commerce store. Backend: **Medusa v2** + PostgreSQL (Docker). Frontend: **Nuxt 4** + **@nuxt/ui v4**.

---

## Setup

### Backend (Docker)

```bash
yarn docker:up
```

Create the first admin user:
```bash
docker compose run --rm medusa yarn medusa user -e admin@admin.com -p admin
```

- Medusa admin: http://localhost:9000/app
- pgAdmin: http://localhost:8080 — login: `admin@admin.com` / `admin`

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs at http://localhost:3000.

---

## LLM Skills

Load these before working on specific areas (type the slash command in Claude Code):

- `/medusa-dev:building-with-medusa` — backend modules, routes, workflows
- `/medusa-dev:building-storefronts` — storefront SDK usage and data fetching
- `/medusa-dev:building-admin-dashboard-customizations` — admin UI widgets/pages
- `/nuxt-ui` — Nuxt UI components and theming

See `AGENTS.md` for the full guide including service layer architecture.

---

## Workflow

**Always work on a branch. Never commit directly to `main`.**

```bash
git checkout -b feat/your-feature
# do work
git push -u origin feat/your-feature
# open a PR
```
