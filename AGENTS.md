# Agent Guide

## What this project is

A headless e-commerce store. The backend is **Medusa v2** (Node.js, TypeScript) running in Docker with PostgreSQL. The frontend is **Nuxt 4** with **@nuxt/ui v4** (Tailwind-based component library). They communicate via the Medusa JS SDK (`@nuxtjs/medusa`).

---

## Using LLM Skills

This project has skills that must be loaded before doing certain work. Always load the relevant skill before planning or writing code — skills contain architectural rules that override generic assumptions.

| Task | Skill to load |
|---|---|
| Medusa backend (modules, routes, workflows, data models) | `/medusa-dev:building-with-medusa` |
| Storefront API calls, SDK usage, data fetching | `/medusa-dev:building-storefronts` |
| Admin dashboard UI (widgets, custom pages) | `/medusa-dev:building-admin-dashboard-customizations` |
| Database migrations | `/medusa-dev:db-migrate` |
| Generate migration files | `/medusa-dev:db-generate` |
| Nuxt UI components, theming, layouts | `/nuxt-ui` |

Also use the **MedusaDocs MCP tool** (`mcp__plugin_medusa-dev_MedusaDocs__ask_medusa_question`) to look up Medusa-specific APIs, module patterns, and configuration options.

---

## Architecture: Service Layer

The frontend uses a **service layer** to decouple presentation from data fetching. The goal is that swapping the backend (e.g. replacing Medusa with another API) only requires changes inside the service layer, not in pages or components.

### Structure

```
frontend/app/
  composables/
    services/           ← service layer lives here
      useProductService.ts
      useCartService.ts
      useOrderService.ts
      useCustomerService.ts
    ...                 ← UI-only composables outside services/
  components/           ← pure presentation, no direct API calls
  pages/                ← calls services, not SDK directly
```

### Rules

- **Pages and components never call the Medusa SDK directly.** They call service composables.
- Service composables own all data fetching, transformation, and error normalisation.
- Types returned from services are local app types, not raw Medusa SDK types. Map at the boundary.
- If Medusa is swapped out, only files inside `composables/services/` need to change.

### Example pattern

```ts
// composables/services/useProductService.ts
export function useProductService() {
  const { client } = useMedusaClient()

  async function getProduct(handle: string) {
    const { product } = await client.store.product.retrieve(handle)
    return mapToAppProduct(product) // transform to local type
  }

  return { getProduct }
}
```

```ts
// pages/[handle].vue — only knows about the service
const { getProduct } = useProductService()
const product = await getProduct(route.params.handle)
```

---

## Backend conventions (Medusa v2)

- Custom logic goes in **modules** (`src/modules/`), not in routes.
- Use **workflows** for any multi-step business logic.
- API routes (`src/api/`) are thin — they call workflows or module services, nothing else.
- Follow the skill guide exactly — Medusa v2 patterns differ significantly from v1.

---

## Frontend conventions (Nuxt 4 + @nuxt/ui v4)

- Use `@nuxt/ui` components wherever possible before writing custom ones.
- Theming is done via `app.config.ts` — do not write arbitrary Tailwind overrides.
- Images go through `@nuxt/image` (`<NuxtImg>`), not plain `<img>`.
- Run the `/nuxt-ui` skill when building new UI sections to stay consistent.

---

## General best practices

- **Always work on a branch**, never commit directly to `main`.
- Keep PRs focused. One concern per PR.
- Run `nuxt typecheck` before committing frontend changes.
- The backend has integration tests in `backend/integration-tests/` — run them before backend PRs.
- Docker is the source of truth for the backend environment. Do not rely on a local Node install for the backend.
