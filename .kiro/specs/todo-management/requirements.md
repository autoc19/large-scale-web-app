# Requirements Document

## Introduction

This specification defines a complete Todo Management domain as a reference implementation of the DDD architecture. It demonstrates the full stack from data models through repositories, services, and UI components, showcasing all architectural patterns including the critical $effect sync pattern, Repository pattern, Service pattern with Runes, and form handling with Superforms + Zod.

## Glossary

- **Todo**: A task item with a title, completion status, and unique identifier
- **TodoService**: Business logic class managing todo state and operations
- **TodoRepository**: Data access interface for todo persistence
- **Domain Component**: UI component specific to the todo domain
- **DTO (Data Transfer Object)**: Object for transferring data between layers
- **Zod Schema**: Runtime validation schema for form data
- **Superforms**: SvelteKit form library with type-safe validation

## Requirements

### Requirement 1: Todo Data Modeling

**User Story:** As a developer, I want clear TypeScript interfaces and validation schemas for todo data, so that I have type safety at compile time and runtime validation for user input.

#### Acceptance Criteria

1. WHEN defining todo data THEN the System SHALL provide a `TodoItem` interface with id, title, and completed properties
2. WHEN defining todo data THEN the System SHALL provide a `CreateTodoDto` interface for creating new todos
3. WHEN defining todo data THEN the System SHALL provide a `UpdateTodoDto` interface for updating existing todos
4. WHEN validating todo creation THEN the System SHALL provide a Zod schema requiring title with minimum 2 characters
5. WHEN validating todo updates THEN the System SHALL provide a Zod schema for updatable fields
6. WHEN exporting types THEN the System SHALL use `z.infer` to derive TypeScript types from Zod schemas

### Requirement 2: Todo Repository Layer

**User Story:** As a developer, I want a repository abstraction for todo data access, so that I can swap implementations (HTTP, Mock, LocalStorage) without changing business logic.

#### Acceptance Criteria

1. WHEN defining the repository interface THEN the System SHALL declare methods for getAll, getById, create, update, and delete operations
2. WHEN the HTTP repository fetches todos THEN the System SHALL use the configured fetch function for SSR compatibility
3. WHEN the HTTP repository encounters an error THEN the System SHALL throw a standard Error with status code and message
4. WHEN the HTTP repository makes requests THEN the System SHALL use publicConfig for the API base URL
5. WHEN creating a mock repository THEN the System SHALL implement the same interface with in-memory storage
6. WHEN the repository returns data THEN the System SHALL return properly typed Promise objects

### Requirement 3: Todo Service Layer

**User Story:** As a developer, I want a service class that encapsulates todo business logic with reactive state, so that I can manage todos with proper error handling and loading states.

#### Acceptance Criteria

1. WHEN the service is instantiated THEN the System SHALL accept a TodoRepository interface and optional initial data
2. WHEN the service manages state THEN the System SHALL use Svelte 5 `$state` for items, loading, and error properties
3. WHEN the service computes derived values THEN the System SHALL provide a completedCount getter using standard JavaScript
4. WHEN the service loads todos THEN the System SHALL set loading to true, call repository, handle errors, and set loading to false
5. WHEN the service encounters an error THEN the System SHALL catch it, set the error state, and NOT throw
6. WHEN the service toggles a todo THEN the System SHALL find the item by id and flip its completed status
7. WHEN the service creates a todo THEN the System SHALL call the repository create method and add the result to items
8. WHEN the service deletes a todo THEN the System SHALL call the repository delete method and remove it from items

### Requirement 4: Todo UI Components

**User Story:** As a developer, I want domain-specific UI components for displaying and interacting with todos, so that I can build the todo interface with reusable, well-structured components.

#### Acceptance Criteria

1. WHEN the TodoList component renders THEN the System SHALL retrieve the TodoService from context using getContext
2. WHEN the TodoList component renders THEN the System SHALL display each todo with title and completion status
3. WHEN the TodoList component renders THEN the System SHALL use the todo id as the key in each blocks
4. WHEN the TodoList component renders THEN the System SHALL apply line-through styling to completed todos
5. WHEN a todo toggle button is clicked THEN the System SHALL call the service toggle method
6. WHEN the TodoList component renders THEN the System SHALL use UI primitives (Button) for actions
7. WHEN the TodoForm component renders THEN the System SHALL use Superforms for form state management
8. WHEN the TodoForm component renders THEN the System SHALL display validation errors from Zod schema
9. WHEN the TodoForm component submits THEN the System SHALL use the enhance action for progressive enhancement

### Requirement 5: Todo Page Integration

**User Story:** As a developer, I want a complete page that demonstrates the critical $effect sync pattern, so that todo data stays synchronized when navigating between routes.

#### Acceptance Criteria

1. WHEN the page load function runs THEN the System SHALL instantiate the HTTP repository with SvelteKit's fetch
2. WHEN the page load function runs THEN the System SHALL fetch all todos and return them in the data object
3. WHEN the page component mounts THEN the System SHALL instantiate TodoService with the repository and initial data
4. WHEN the page component mounts THEN the System SHALL inject the service into context using setContext
5. WHEN the route data changes THEN the System SHALL use `$effect` to sync service.items with data.items
6. WHEN the service has an error THEN the System SHALL display an error message in the UI
7. WHEN the page renders THEN the System SHALL delegate rendering to the TodoList domain component

### Requirement 6: Todo Form Handling

**User Story:** As a developer, I want server-side form actions with validation, so that I can create and update todos with proper error handling and type safety.

#### Acceptance Criteria

1. WHEN the server load function runs THEN the System SHALL initialize an empty Superform with the createTodoSchema
2. WHEN a create action is submitted THEN the System SHALL validate the form data against the Zod schema
3. WHEN form validation fails THEN the System SHALL return a 400 error with the form containing validation errors
4. WHEN form validation succeeds THEN the System SHALL call the repository to create the todo
5. WHEN the create action succeeds THEN the System SHALL return the form with success status
6. WHEN the client form is initialized THEN the System SHALL use superForm with resetForm option enabled
7. WHEN the form is submitted THEN the System SHALL use the enhance action for progressive enhancement

### Requirement 7: Todo Service Testing

**User Story:** As a developer, I want comprehensive unit tests for the TodoService, so that I can verify business logic works correctly in isolation.

#### Acceptance Criteria

1. WHEN testing the service THEN the System SHALL use Vitest with describe, it, and expect
2. WHEN testing the service THEN the System SHALL mock the repository using vi.fn()
3. WHEN testing toggle functionality THEN the System SHALL verify the completed status flips correctly
4. WHEN testing load functionality THEN the System SHALL verify loading states and error handling
5. WHEN testing create functionality THEN the System SHALL verify new items are added to the items array
6. WHEN testing with initial data THEN the System SHALL verify the service initializes with provided data
7. WHEN testing derived state THEN the System SHALL verify completedCount returns the correct value

### Requirement 8: Todo Error Handling

**User Story:** As a developer, I want proper error handling throughout the todo domain, so that users see helpful messages and the application remains stable.

#### Acceptance Criteria

1. WHEN the repository encounters a network error THEN the System SHALL throw an Error with a descriptive message
2. WHEN the service catches a repository error THEN the System SHALL set the error state with the error message
3. WHEN the service catches an error THEN the System SHALL set loading to false in the finally block
4. WHEN the UI displays an error THEN the System SHALL show the error message in a styled error component
5. WHEN a new operation starts THEN the System SHALL clear the previous error state

### Requirement 9: Todo State Synchronization

**User Story:** As a developer, I want the critical $effect pattern demonstrated, so that todo data stays synchronized during client-side navigation.

#### Acceptance Criteria

1. WHEN route parameters change THEN the System SHALL trigger the load function to fetch new data
2. WHEN the data prop updates THEN the System SHALL use `$effect` to sync service.items with data.items
3. WHEN the service constructor runs THEN the System SHALL initialize with the initial data from props
4. WHEN client-side navigation occurs THEN the System SHALL NOT remount the component
5. WHEN the $effect runs THEN the System SHALL update the service state to match the new route data

### Requirement 10: Todo Component Storybook Stories

**User Story:** As a developer, I want Storybook stories for todo components, so that I can develop and test components in isolation.

#### Acceptance Criteria

1. WHEN viewing Button stories THEN the System SHALL display all variants (primary, secondary, danger)
2. WHEN viewing TodoList stories THEN the System SHALL provide mock service data for different states
3. WHEN viewing TodoForm stories THEN the System SHALL demonstrate form validation and submission
4. WHEN stories are created THEN the System SHALL use Svelte CSF format
5. WHEN stories are created THEN the System SHALL include accessibility checks
