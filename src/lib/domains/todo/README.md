# Todo Domain

This is a reference implementation of the Todo Management domain using Domain-Driven Design (DDD) principles with Svelte 5 and SvelteKit.

## Architecture Overview

The Todo domain demonstrates the complete layered architecture pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                    Route Layer (Glue)                       │
│              src/routes/todos/+page.svelte                  │
│  - Instantiate services with loaded data                    │
│  - Inject services via setContext                           │
│  - Use $effect to sync service state with route data        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Component Layer (UI)                       │
│  - TodoList.svelte (renders todos from service)             │
│  - TodoItem.svelte (individual todo item)                   │
│  - TodoForm.svelte (create new todo)                        │
│  - Get service from context, bind to state                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Service Layer (Logic)                      │
│              todo.service.svelte.ts                         │
│  - Encapsulates business logic                              │
│  - Manages reactive state with Svelte 5 Runes              │
│  - Handles errors (catch, don't throw)                      │
│  - Depends on Repository interface                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Repository Layer (Data Access)                 │
│  - todo.repository.ts (interface)                           │
│  - todo.repository.http.ts (HTTP implementation)            │
│  - Isolates data access logic                               │
│  - Throws errors for service to catch                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    API / Data Source                        │
│              External HTTP API or Database                  │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/lib/domains/todo/
├── components/              # Domain-specific UI components
│   ├── TodoItem.svelte     # Single todo item component
│   ├── TodoList.svelte     # List of todos with loading/error states
│   └── TodoForm.svelte     # Form to create new todos
├── models/                  # Data contracts and validation
│   ├── todo.types.ts       # TypeScript interfaces (TodoItem, DTOs)
│   └── todo.schema.ts      # Zod validation schemas
├── services/                # Business logic
│   └── todo.service.svelte.ts  # TodoService with Svelte 5 Runes
└── repositories/            # Data access layer
    ├── todo.repository.ts       # Repository interface
    └── todo.repository.http.ts  # HTTP implementation
```

## Key Patterns

### 1. Repository Pattern (Anti-Corruption Layer)

The Repository pattern isolates data access logic from business logic, making the code testable and allowing easy swapping of implementations.

**Interface Definition:**
```typescript
// src/lib/domains/todo/repositories/todo.repository.ts
export interface TodoRepository {
  getAll(): Promise<TodoItem[]>;
  getById(id: string): Promise<TodoItem>;
  create(dto: CreateTodoDto): Promise<TodoItem>;
  update(id: string, dto: UpdateTodoDto): Promise<TodoItem>;
  delete(id: string): Promise<void>;
}
```

**HTTP Implementation:**
```typescript
// src/lib/domains/todo/repositories/todo.repository.http.ts
export class HttpTodoRepository implements TodoRepository {
  constructor(private fetchFn: typeof fetch) {}

  async getAll(): Promise<TodoItem[]> {
    const res = await this.fetchFn(`${publicConfig.apiBase}/todos`);
    if (!res.ok) {
      throw new Error(`Failed to fetch todos: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  // ... other methods
}
```

**Benefits:**
- Easy to swap implementations (HTTP, Mock, LocalStorage)
- Testable without real API calls
- Business logic doesn't depend on data source
- Supports offline mode and caching

### 2. Service Pattern with Svelte 5 Runes

The Service class encapsulates business logic and manages reactive state using Svelte 5 Runes.

**State Management:**
```typescript
// src/lib/domains/todo/services/todo.service.svelte.ts
export class TodoService {
  // Reactive state
  items = $state<TodoItem[]>([]);
  loading = $state(false);
  error = $state<string | null>(null);
  selectedId = $state<string | null>(null);

  // Derived state (computed)
  get completedCount(): number {
    return this.items.filter((t) => t.completed).length;
  }

  get pendingCount(): number {
    return this.items.filter((t) => !t.completed).length;
  }

  constructor(
    private repo: TodoRepository,
    initialData: TodoItem[] = []
  ) {
    this.items = initialData;
  }

  // Business logic methods
  async loadTodos(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      this.items = await this.repo.getAll();
    } catch (err) {
      this.error = (err as Error).message;
    } finally {
      this.loading = false;
    }
  }

  toggle(id: string): void {
    const todo = this.items.find((t) => t.id === id);
    if (todo) todo.completed = !todo.completed;
  }
}
```

**Key Features:**
- `$state` for reactive state
- `$derived` for computed values (not used here, but available)
- Error handling: catch errors and set error state (don't throw)
- Loading state management
- Optimistic updates with rollback

### 3. Critical $effect Sync Pattern

This is the most important pattern in this implementation. When using SvelteKit with client-side navigation, the page component doesn't remount, but the `data` prop changes. Without syncing, the Service would hold stale data.

**Problem:**
```typescript
// Without $effect sync, service.items becomes stale after navigation
const service = new TodoService(repo, data.items);
// When route changes, data.items updates but service.items doesn't
```

**Solution:**
```typescript
// src/routes/todos/+page.svelte
interface Props {
  data: { items: TodoItem[] };
}

let { data }: Props = $props();

const repo = new HttpTodoRepository(fetch);
const service = new TodoService(repo, data.items);
setContext(TODO_SERVICE_KEY, service);

// CRITICAL: Sync service state when route data changes
$effect(() => {
  service.items = data.items;
});
```

**Why It's Critical:**
- Client-side navigation doesn't remount the component
- Service constructor only runs once on mount
- Route data changes but Service state doesn't
- Without this, users see stale data after navigation
- This pattern must be used in every page that uses Services

### 4. Dependency Injection with Context

Services are injected into the component tree using Svelte's context API, avoiding prop drilling and enabling loose coupling.

**Injection (in page):**
```typescript
import { setContext } from 'svelte';
import { TODO_SERVICE_KEY } from '$core/context/keys';

const service = new TodoService(repo, data.items);
setContext(TODO_SERVICE_KEY, service);
```

**Consumption (in components):**
```typescript
import { getContext } from 'svelte';
import { TODO_SERVICE_KEY } from '$core/context/keys';
import type { TodoService } from '../services/todo.service.svelte';

const service = getContext<TodoService>(TODO_SERVICE_KEY);
```

**Benefits:**
- Avoid prop drilling
- Components are loosely coupled
- Easy to test (mock service in tests)
- Follows DDD principles

### 5. Form Handling with Superforms + Zod

Forms use Superforms for state management and Zod for validation, providing type-safe form handling.

**Schema Definition:**
```typescript
// src/lib/domains/todo/models/todo.schema.ts
import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters')
});

export type CreateTodoSchema = z.infer<typeof createTodoSchema>;
```

**Server Action:**
```typescript
// src/routes/todos/+page.server.ts
export const actions = {
  create: async ({ request, fetch }) => {
    const form = await superValidate(request, zod(createTodoSchema));
    if (!form.valid) return fail(400, { form });

    const repo = new HttpTodoRepository(fetch);
    await repo.create(form.data);

    return { form };
  }
};
```

**Client Binding:**
```svelte
<!-- src/lib/domains/todo/components/TodoForm.svelte -->
<script lang="ts">
  import { superForm } from 'sveltekit-superforms';

  interface Props {
    data: { form: SuperValidated<CreateTodoSchema> };
  }

  let { data }: Props = $props();
  const { form, errors, enhance, submitting } = superForm(data.form, {
    resetForm: true
  });
</script>

<form method="POST" action="?/create" use:enhance>
  <input name="title" bind:value={$form.title} />
  {#if $errors.title}
    <span class="text-red-500">{$errors.title}</span>
  {/if}
  <button type="submit" disabled={$submitting}>
    {$submitting ? 'Creating...' : 'Create Todo'}
  </button>
</form>
```

## Component Usage

### TodoList Component

Renders a list of todos from the service, with loading and error states.

```svelte
<script lang="ts">
  import { getContext } from 'svelte';
  import { TODO_SERVICE_KEY } from '$core/context/keys';
  import TodoItem from './TodoItem.svelte';

  const service = getContext(TODO_SERVICE_KEY);
</script>

{#if service.loading}
  <p>Loading...</p>
{:else if service.error}
  <p class="text-red-500">{service.error}</p>
{:else if service.items.length === 0}
  <p>No todos yet</p>
{:else}
  <div class="space-y-2">
    {#each service.items as todo (todo.id)}
      <TodoItem
        {todo}
        onToggle={() => service.toggle(todo.id)}
        onDelete={() => service.deleteTodo(todo.id)}
        onSelect={() => service.select(todo.id)}
      />
    {/each}
  </div>
{/if}
```

### TodoItem Component

Renders a single todo item with toggle and delete buttons.

```svelte
<script lang="ts">
  interface Props {
    todo: TodoItem;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onSelect: (id: string) => void;
    class?: string;
  }

  let { todo, onToggle, onDelete, onSelect, class: className }: Props = $props();
</script>

<div class={className} onclick={() => onSelect(todo.id)}>
  <span class:line-through={todo.completed}>{todo.title}</span>
  <button onclick={() => onToggle(todo.id)}>
    {todo.completed ? 'Undo' : 'Done'}
  </button>
  <button onclick={() => onDelete(todo.id)}>Delete</button>
</div>
```

## Error Handling

### Repository Layer

Repositories throw standard Error objects with descriptive messages:

```typescript
async getAll(): Promise<TodoItem[]> {
  const res = await this.fetchFn(`${publicConfig.apiBase}/todos`);
  if (!res.ok) {
    throw new Error(`Failed to fetch todos: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
```

### Service Layer

Services catch errors and set error state (don't throw):

```typescript
async loadTodos(): Promise<void> {
  this.loading = true;
  this.error = null;
  try {
    this.items = await this.repo.getAll();
  } catch (err) {
    this.error = (err as Error).message;
    console.error('Failed to load todos:', err);
  } finally {
    this.loading = false;
  }
}
```

### UI Layer

Components display error messages from the service:

```svelte
{#if service.error}
  <div class="rounded border border-red-200 p-4 text-red-500">
    {service.error}
  </div>
{/if}
```

## Svelte 5 Compliance

This implementation follows all Svelte 5 best practices:

- ✅ `$props()` instead of `export let`
- ✅ `$state` for reactive state
- ✅ `$derived` for computed values
- ✅ `$effect` for side effects and data sync
- ✅ `onclick` instead of `on:click`
- ✅ Snippets instead of slots
- ✅ `$bindable()` for two-way binding
- ✅ No `createEventDispatcher` (use callback props)

## Testing

### Unit Testing Services

Services are tested in isolation using a mock repository:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { TodoService } from './todo.service.svelte';

const mockRepo = {
  getAll: vi.fn(),
  create: vi.fn(),
  // ... other methods
};

describe('TodoService', () => {
  it('should toggle todo status', () => {
    const service = new TodoService(mockRepo, [
      { id: '1', title: 'Test', completed: false, createdAt: '', updatedAt: '' }
    ]);
    service.toggle('1');
    expect(service.items[0].completed).toBe(true);
  });
});
```

### Component Testing

Components are tested with Vitest browser mode or Storybook:

```typescript
import { render, screen } from 'vitest-browser-vue';
import TodoItem from './TodoItem.svelte';

describe('TodoItem', () => {
  it('should render todo title', () => {
    const todo = { id: '1', title: 'Test', completed: false };
    render(TodoItem, { props: { todo } });
    expect(screen.getByText('Test')).toBeVisible();
  });
});
```

## Best Practices

1. **Always use the Repository interface**, not the implementation
2. **Catch errors in Services**, don't let them bubble up
3. **Use $effect to sync Service state** with route data in pages
4. **Inject Services via context**, don't pass as props
5. **Keep components simple**, move logic to Services
6. **Use Zod schemas** for form validation
7. **Use Superforms** for form state management
8. **Test Services in isolation** with mock repositories

## Related Documentation

- [Architecture Principles](../../steering/architecture-principles.md)
- [Critical Patterns](../../steering/critical-patterns.md)
- [Svelte 5 Syntax](../../steering/svelte5-syntax.md)
- [Development Workflow](../../steering/development-workflow.md)

## Future Enhancements

- Add pagination for large todo lists
- Implement optimistic updates with rollback
- Add offline support with LocalStorage repository
- Add real-time updates with WebSocket
- Add todo categories/tags
- Add due dates and reminders
