# Todo Domain Architecture

This document provides visual representations of the Todo domain architecture and data flow.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SvelteKit Application                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        Route Layer (Glue)                           │  │
│  │                    src/routes/todos/+page.svelte                   │  │
│  │                                                                    │  │
│  │  1. Instantiate HttpTodoRepository with fetch                    │  │
│  │  2. Instantiate TodoService with repository and initial data    │  │
│  │  3. Inject service into context with setContext()              │  │
│  │  4. Use $effect to sync service.items with data.items          │  │
│  │                                                                    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    ↓                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      Component Layer (UI)                           │  │
│  │                                                                    │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │ TodoList Component                                          │ │  │
│  │  │ - Get TodoService from context                             │ │  │
│  │  │ - Render each todo with TodoItem                           │ │  │
│  │  │ - Display loading/error/empty states                       │ │  │
│  │  │                                                             │ │  │
│  │  │  ┌──────────────────────────────────────────────────────┐ │ │  │
│  │  │  │ TodoItem Component (repeated for each todo)         │ │ │  │
│  │  │  │ - Display todo title with line-through if done      │ │ │  │
│  │  │  │ - Toggle button → calls service.toggle()           │ │ │  │
│  │  │  │ - Delete button → calls service.deleteTodo()       │ │ │  │
│  │  │  │ - Select button → calls service.select()           │ │ │  │
│  │  │  └──────────────────────────────────────────────────────┘ │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  │                                                                    │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │ TodoForm Component                                          │ │  │
│  │  │ - Use Superforms for form state                            │ │  │
│  │  │ - Bind form.title to input                                 │ │  │
│  │  │ - Display validation errors                                │ │  │
│  │  │ - Submit → server action → service.createTodo()           │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  │                                                                    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    ↓                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      Service Layer (Logic)                          │  │
│  │                  todo.service.svelte.ts                            │  │
│  │                                                                    │  │
│  │  State:                                                            │  │
│  │  - items: TodoItem[] ($state)                                    │  │
│  │  - loading: boolean ($state)                                     │  │
│  │  - error: string | null ($state)                                 │  │
│  │  - selectedId: string | null ($state)                            │  │
│  │                                                                    │  │
│  │  Derived:                                                          │  │
│  │  - completedCount: number (getter)                               │  │
│  │  - pendingCount: number (getter)                                 │  │
│  │  - selectedItem: TodoItem | undefined (getter)                   │  │
│  │                                                                    │  │
│  │  Methods:                                                          │  │
│  │  - loadTodos(): Promise<void>                                    │  │
│  │  - createTodo(dto): Promise<void>                                │  │
│  │  - toggle(id): Promise<void> (optimistic update)                │  │
│  │  - deleteTodo(id): Promise<void>                                 │  │
│  │  - select(id): void                                              │  │
│  │  - clearSelection(): void                                         │  │
│  │                                                                    │  │
│  │  Error Handling:                                                   │  │
│  │  - Catch all errors from repository                              │  │
│  │  - Set error state (don't throw)                                 │  │
│  │  - Clear error on new operation                                  │  │
│  │  - Log errors to console                                         │  │
│  │                                                                    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    ↓                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                  Repository Layer (Data Access)                     │  │
│  │                                                                    │  │
│  │  Interface: TodoRepository                                        │  │
│  │  - getAll(): Promise<TodoItem[]>                                 │  │
│  │  - getById(id): Promise<TodoItem>                                │  │
│  │  - create(dto): Promise<TodoItem>                                │  │
│  │  - update(id, dto): Promise<TodoItem>                            │  │
│  │  - delete(id): Promise<void>                                     │  │
│  │                                                                    │  │
│  │  Implementation: HttpTodoRepository                               │  │
│  │  - Uses SvelteKit fetch for SSR compatibility                    │  │
│  │  - Uses publicConfig.apiBase for API URL                         │  │
│  │  - Throws Error on non-2xx responses                             │  │
│  │  - Includes descriptive error messages                           │  │
│  │                                                                    │  │
│  │  Error Handling:                                                   │  │
│  │  - Throw Error with status code and message                      │  │
│  │  - Include operation context (fetch, create, update, delete)     │  │
│  │  - Let service layer catch and handle                            │  │
│  │                                                                    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    ↓                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      External API / Data Source                     │  │
│  │                                                                    │  │
│  │  HTTP Endpoints:                                                   │  │
│  │  - GET /api/todos → TodoItem[]                                   │  │
│  │  - GET /api/todos/:id → TodoItem                                 │  │
│  │  - POST /api/todos → TodoItem                                    │  │
│  │  - PUT /api/todos/:id → TodoItem                                 │  │
│  │  - DELETE /api/todos/:id → void                                  │  │
│  │                                                                    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### User Creates a Todo

```
User Types Title
       ↓
User Clicks "Create Todo"
       ↓
TodoForm Component
  - Validates with Zod schema
  - Sends to server action
       ↓
Server Action (+page.server.ts)
  - Validates form data
  - Instantiates HttpTodoRepository
  - Calls repository.create(dto)
       ↓
HttpTodoRepository
  - Makes POST request to /api/todos
  - Returns new TodoItem
       ↓
Server Action
  - Returns form with success
       ↓
Client (TodoForm)
  - Resets form
  - Triggers page reload or manual sync
       ↓
Page Component
  - load() function runs
  - Fetches updated todos
  - Updates data.items
       ↓
$effect in Page Component
  - Detects data.items change
  - Syncs service.items = data.items
       ↓
TodoService
  - items array updated
  - Triggers reactivity
       ↓
TodoList Component
  - Detects service.items change
  - Re-renders with new todo
       ↓
User Sees New Todo in List
```

### User Toggles a Todo (Optimistic Update)

```
User Clicks Toggle Button
       ↓
TodoItem Component
  - Calls service.toggle(id)
       ↓
TodoService.toggle()
  - Find todo by id
  - Store previous completed state
  - Update todo.completed immediately (optimistic)
  - UI updates instantly
       ↓
Service Sends Request
  - Calls repository.update(id, { completed: true })
       ↓
HttpTodoRepository
  - Makes PUT request to /api/todos/:id
       ↓
Server Response
    ↙        ↘
Success    Error
   ↓          ↓
Keep UI    Rollback
updated    todo.completed
           to previous
           state
           Set error
           state
```

### User Navigates Between Routes

```
User Clicks Link to Different Route
       ↓
SvelteKit Router
  - Calls load() function for new route
  - Fetches new data
  - Updates data prop
       ↓
Page Component
  - Component NOT remounted (important!)
  - data prop updates
  - $effect dependency triggers
       ↓
$effect in Page Component
  - Detects data.items changed
  - Syncs service.items = data.items
       ↓
TodoService
  - items array updated with new data
  - Triggers reactivity
       ↓
TodoList Component
  - Detects service.items change
  - Re-renders with new todos
       ↓
User Sees New Todos for New Route
```

## Error Handling Flow

```
User Action (Create, Toggle, Delete)
       ↓
Component Calls Service Method
       ↓
Service Method
  - Set loading = true
  - Set error = null
  - Try to call repository
       ↓
Repository
  - Makes API request
  - Checks response status
       ↓
Response Status
    ↙        ↘
2xx        Non-2xx
 ↓           ↓
Success    Throw Error
 ↓           ↓
Return    Error bubbles
data      to service
 ↓           ↓
Service    Service
catches    catches
success    error
 ↓           ↓
Update    Set error
state     state
 ↓           ↓
Set        Log to
loading    console
= false    ↓
 ↓         Set
Return     loading
 ↓         = false
UI         ↓
updates    Return
 ↓         ↓
User       UI
sees       displays
success    error
           message
           ↓
           User sees
           error
```

## State Management Diagram

### TodoService State

```
┌─────────────────────────────────────────────────────────────┐
│                    TodoService State                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  items: TodoItem[]                                          │
│  ├─ id: string                                              │
│  ├─ title: string                                           │
│  ├─ completed: boolean                                      │
│  ├─ createdAt: string                                       │
│  └─ updatedAt: string                                       │
│                                                             │
│  loading: boolean                                           │
│  ├─ true during async operations                           │
│  └─ false when complete                                     │
│                                                             │
│  error: string | null                                       │
│  ├─ null when no error                                      │
│  ├─ error message when error occurs                         │
│  └─ cleared on new operation                                │
│                                                             │
│  selectedId: string | null                                  │
│  ├─ null when nothing selected                              │
│  └─ id of selected todo                                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                   Derived State (Getters)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  completedCount: number                                     │
│  └─ Count of items where completed = true                  │
│                                                             │
│  pendingCount: number                                       │
│  └─ Count of items where completed = false                 │
│                                                             │
│  selectedItem: TodoItem | undefined                         │
│  └─ Item matching selectedId or undefined                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
+page.svelte (Page Component)
├─ Instantiates TodoService
├─ Injects service via setContext
├─ Uses $effect to sync data
│
├─ TodoForm Component
│  └─ Uses Superforms for form state
│     └─ Calls service.createTodo() on submit
│
└─ TodoList Component
   ├─ Gets TodoService from context
   ├─ Displays loading state
   ├─ Displays error message
   ├─ Displays empty state
   │
   └─ TodoItem Component (repeated for each todo)
      ├─ Displays todo title
      ├─ Toggle button → calls service.toggle()
      ├─ Delete button → calls service.deleteTodo()
      └─ Select button → calls service.select()
```

## Dependency Injection Flow

```
Page Component
│
├─ Creates TodoService instance
│  └─ Passes TodoRepository interface
│
├─ Calls setContext(TODO_SERVICE_KEY, service)
│  └─ Makes service available to all child components
│
└─ Child Components
   │
   ├─ TodoList
   │  └─ Calls getContext(TODO_SERVICE_KEY)
   │     └─ Gets TodoService instance
   │
   └─ TodoForm
      └─ (Doesn't need service, uses Superforms)
```

## Type Flow

```
Zod Schema (todo.schema.ts)
│
├─ createTodoSchema
│  └─ z.infer<typeof createTodoSchema>
│     └─ CreateTodoSchema type
│
├─ Used in Server Action
│  └─ superValidate(request, zod(createTodoSchema))
│     └─ Returns SuperValidated<CreateTodoSchema>
│
├─ Passed to Client
│  └─ TodoForm receives form prop
│     └─ Type: SuperValidated<CreateTodoSchema>
│
└─ Used in Component
   └─ $form.title is typed as string
   └─ $errors.title is typed as string[] | undefined
```

## Critical $effect Sync Pattern

```
Route Change
     ↓
load() function runs
     ↓
data prop updates
     ↓
$effect dependency triggers
     ↓
$effect(() => {
  service.items = data.items;
})
     ↓
Service state updated
     ↓
Components detect change
     ↓
UI re-renders with new data
```

## Performance Considerations

### Optimistic Updates

```
User Action
     ↓
UI Updates Immediately
     ↓
Request Sent (async)
     ↓
User Sees Result Instantly
     ↓
Server Response
     ├─ Success: Keep UI
     └─ Error: Rollback UI
```

### Reactive State

```
Service State Changes
     ↓
$state triggers reactivity
     ↓
Components detect change
     ↓
Only affected components re-render
     ↓
Efficient updates
```

## Testing Architecture

```
Unit Tests
├─ TodoService Tests
│  └─ Mock TodoRepository
│     └─ Test business logic
│
├─ Component Tests
│  └─ Mock TodoService via setContext
│     └─ Test rendering and interactions
│
└─ Schema Tests
   └─ Test Zod validation

Integration Tests
├─ Page Integration
│  └─ Test $effect sync
│  └─ Test service injection
│
└─ Form Integration
   └─ Test server action
   └─ Test client binding

E2E Tests
├─ Create Todo Flow
├─ Toggle Todo Flow
├─ Delete Todo Flow
└─ Error Handling Flow
```

---

## Related Documentation

- [README.md](./README.md) - Domain overview
- [CRITICAL_PATTERNS.md](./CRITICAL_PATTERNS.md) - Detailed pattern explanations
- [../../steering/architecture-principles.md](../../steering/architecture-principles.md) - Global architecture
