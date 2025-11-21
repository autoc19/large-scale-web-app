# Architecture Principles

## Core Design Principles

### 1. Contract-First Development (契約優先)

- **Always define TypeScript interfaces before writing UI**
- Create models in `models/*.types.ts` first
- Define repository interfaces before implementations
- Use Zod schemas for runtime validation

### 2. Screaming Architecture (咆哮式架構)

- **Directory structure reflects business domains, not technical layers**
- Organize by feature/domain (auth, inventory, users), not by type (components, services)
- A developer should understand the business by looking at folder names
- Example: `domains/auth/` not `services/auth-service.ts`

### 3. Logic Externalization (邏輯外置)

- **UI components (.svelte) are for rendering only**
- All business logic must be in Service classes (.svelte.ts)
- Services use Svelte 5 Runes for reactive state management
- Components consume services via dependency injection

### 4. Anti-Corruption Layer (防腐層設計)

- **UI never calls APIs directly**
- All data access goes through Repository pattern
- Repository interface defines the contract
- Implementations (HTTP, Mock, LocalStorage) are swappable
- Isolates business logic from external dependencies

## Layered Architecture

### Configuration Layer (配置層)

- **Purpose**: Type-safe environment variable access
- **Location**: `src/lib/config/`
- **Rule**: Never import from `$env` directly in business code
- **Pattern**: Wrap all env vars in typed config objects with validation

### Core Layer (核心層)

- **Purpose**: Business-agnostic infrastructure
- **Location**: `src/lib/core/`
- **Contains**: HTTP clients, DI keys, i18n setup
- **Rule**: No domain-specific logic allowed

### Presentation Layer (展示層)

- **Purpose**: Reusable UI components (Design System)
- **Location**: `src/lib/ui/`
- **Rule**: Pure presentational, no business logic, no API calls
- **Pattern**: Use Snippets instead of Slots (Svelte 5)

### Domain Layer (領域層)

- **Purpose**: Business logic and domain-specific UI
- **Location**: `src/lib/domains/[domain]/`
- **Structure**: Each domain is self-contained with components, models, services, repositories
- **Rule**: Domains should be loosely coupled

### Server Layer (後端層)

- **Purpose**: Server-only code (secrets, database)
- **Location**: `src/lib/server/`
- **Rule**: Never imported by client code

### Route Layer (路由層)

- **Purpose**: Glue code for data loading and DI assembly
- **Location**: `src/routes/`
- **Rule**: Minimal logic, just wire things together

## Separation of Concerns

### What Goes Where

**Models** (`models/*.types.ts`, `models/*.schema.ts`)

- TypeScript interfaces and types
- DTOs (Data Transfer Objects)
- Zod validation schemas
- No logic, just data contracts

**Repositories** (`repositories/*.repository.ts`)

- Interface: Define data access contract
- Implementation: HTTP, Mock, LocalStorage, etc.
- Responsibility: Fetch and persist data
- Error handling: Throw standard Error objects

**Services** (`services/*.service.svelte.ts`)

- Business logic and state management
- Use Svelte 5 Runes ($state, $derived)
- Depend on Repository interfaces (not implementations)
- Error handling: Catch errors, set error state (don't throw)

**Components** (`components/*.svelte`)

- Domain-specific UI components
- Get services from context (getContext)
- Bind to service state
- No business logic, no API calls

**UI Primitives** (`ui/primitives/*.svelte`)

- Generic, reusable components
- No domain knowledge
- Accept props and snippets
- Styled with Tailwind

**Pages** (`routes/[route]/+page.svelte`)

- Instantiate services with loaded data
- Inject services via setContext
- Use $effect to sync service state with route data
- Minimal rendering, delegate to domain components

## Critical Patterns

### The $effect Sync Pattern

**Problem**: When route params change, load function reruns but service constructor doesn't.

**Solution**: Always sync service state with route data using $effect:

```typescript
let { data } = $props();
const service = new TodoService(repo, data.items);
setContext(TODO_SERVICE_KEY, service);

// Critical: Sync service when route data changes
$effect(() => {
	service.items = data.items;
});
```

### Repository Pattern

**Interface defines contract**:

```typescript
export interface TodoRepository {
	getAll(): Promise<TodoItem[]>;
	create(dto: CreateTodoDto): Promise<TodoItem>;
}
```

**Implementation is swappable**:

```typescript
export class HttpTodoRepository implements TodoRepository {
	constructor(private fetchFn: typeof fetch) {}
	// Implementation details
}
```

### Service Pattern

**Encapsulate state and logic**:

```typescript
export class TodoService {
	items = $state<TodoItem[]>([]);
	loading = $state(false);
	error = $state<string | null>(null);

	get completedCount() {
		return this.items.filter((t) => t.completed).length;
	}

	constructor(
		private repo: TodoRepository,
		initialData: TodoItem[] = []
	) {
		this.items = initialData;
	}

	async loadTodos() {
		/* ... */
	}
	toggle(id: string) {
		/* ... */
	}
}
```

### Dependency Injection Pattern

**Define keys as Symbols**:

```typescript
// src/lib/core/context/keys.ts
export const TODO_SERVICE_KEY = Symbol('TODO_SERVICE');
```

**Inject in page**:

```typescript
setContext(TODO_SERVICE_KEY, service);
```

**Consume in component**:

```typescript
const service = getContext<TodoService>(TODO_SERVICE_KEY);
```

## Design Goals

- **Scalability**: Easy to add new domains and features
- **Testability**: Business logic isolated in testable services
- **Maintainability**: Clear boundaries and responsibilities
- **Type Safety**: TypeScript strict mode, no `any`
- **Loose Coupling**: Depend on interfaces, not implementations
- **High Cohesion**: Related code stays together in domains
