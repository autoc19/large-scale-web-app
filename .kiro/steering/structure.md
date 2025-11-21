# Project Structure

## Directory Organization

The project follows Domain-Driven Design (DDD) principles with clear separation of concerns:

```
src/
├── lib/
│   ├── config/             # [配置層] Type-safe environment variable wrappers
│   │   ├── env.public.ts  # Client-safe public config
│   │   └── env.private.ts # Server-only private config
│   ├── core/               # [核心層] Infrastructure (business-agnostic)
│   │   ├── api/           # HTTP client wrappers
│   │   ├── context/       # Dependency injection Symbol keys
│   │   │   └── keys.ts    # All context keys as Symbols
│   │   └── i18n/          # Paraglide i18n configuration
│   ├── ui/                 # [展示層] Atomic design system components
│   │   ├── primitives/    # Base components (Button, Modal, Input)
│   │   └── layouts/       # Layout components
│   ├── domains/            # [領域層] Business domain modules (DDD)
│   │   └── [domain]/      # Each domain (e.g., auth, inventory, users)
│   │       ├── components/    # Domain-specific UI components
│   │       ├── models/        # Data contracts
│   │       │   ├── *.types.ts   # TypeScript interfaces & DTOs
│   │       │   └── *.schema.ts  # Zod validation schemas
│   │       ├── services/      # Business logic classes
│   │       │   └── *.service.svelte.ts  # Service with Runes
│   │       └── repositories/  # Data access layer (Anti-Corruption Layer)
│   │           ├── *.repository.ts       # Repository interface
│   │           └── *.repository.http.ts  # HTTP implementation
│   └── server/             # [後端層] Server-only code (secrets, DB)
├── routes/                 # [路由層] SvelteKit routing (glue code only)
│   └── [route]/
│       ├── +page.ts        # Universal data loading
│       ├── +page.server.ts # Server actions & server-only loads
│       └── +page.svelte    # Page component (DI assembly)
└── stories/                # Storybook stories and assets

messages/                   # i18n translation files (en, zh-tw, jp)
project.inlang/            # Paraglide i18n configuration
e2e/                       # Playwright E2E tests
.storybook/                # Storybook configuration
docs/                      # Architecture documentation
```

## Key Conventions

### File Naming

- Components: PascalCase (e.g., `Button.svelte`, `TodoList.svelte`)
- Services: camelCase with `.svelte.ts` extension (e.g., `todo.service.svelte.ts`)
- Types/Models: camelCase with `.types.ts` or `.schema.ts` (e.g., `todo.types.ts`)
- Repositories: camelCase with `.repository.ts` (e.g., `todo.repository.http.ts`)
- Tests: Same name as file with `.test.ts` or `.spec.ts` suffix

### Svelte 5 Runes Usage

- Use `$state` for reactive state in `.svelte.ts` files
- Use `$props()` instead of `export let` in components
- Use `$derived` for computed values
- Use `$effect` for side effects and data synchronization
- Use `snippets` instead of slots for component composition

### Component Architecture

- **UI Layer** (`src/lib/ui`): Pure presentational components, no business logic
- **Domain Layer** (`src/lib/domains`): Business logic in Service classes, domain-specific UI
- **Route Layer** (`src/routes`): Data loading and dependency injection only

### Dependency Injection

- Use Svelte's `setContext` and `getContext` for DI
- Define context keys as Symbols in `src/lib/core/context/keys.ts`
- Inject services in `+page.svelte`, consume in domain components

### Data Flow Pattern

1. `+page.ts` or `+page.server.ts`: Load data via Repository
2. `+page.svelte`: Instantiate Service with loaded data, inject via context
3. Use `$effect` to sync Service state when route data changes
4. Domain components: Get Service from context, bind to UI

### Environment Variables

- Never import from `$env` directly in business code
- Wrap in type-safe config objects in `src/lib/config/`
- Public config: `env.public.ts` (client-safe)
- Private config: `env.private.ts` (server-only)

### Testing Strategy

- Unit tests for Services (business logic)
- Component tests for UI in Storybook
- Integration tests with Vitest browser mode
- E2E tests with Playwright in `e2e/` directory

### Path Aliases (Recommended)

- `$lib`: `src/lib` (SvelteKit default)
- `$core`: `src/lib/core` (infrastructure)
- `$ui`: `src/lib/ui` (design system)
- `$domains`: `src/lib/domains` (business domains)
- `$config`: `src/lib/config` (configuration)
- `$server`: `src/lib/server` (server-only)
- `$paraglide`: `src/lib/paraglide` (i18n generated)

Configure in `svelte.config.js` under `kit.alias`
