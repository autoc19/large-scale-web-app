# Product Overview

This is a large-scale enterprise web application built with SvelteKit, designed to demonstrate best practices for scalable frontend architecture using Svelte 5 and Domain-Driven Design principles.

## Project Vision

Build a maintainable, testable, and scalable web application that serves as a reference implementation for enterprise-grade SvelteKit projects. The architecture prioritizes developer experience, code quality, and long-term maintainability.

## Key Features

- **Component-driven development** with Storybook integration for isolated component development
- **Multi-language support** (English, Traditional Chinese, Japanese) via Paraglide JS
- **Comprehensive testing** setup (unit tests with Vitest, E2E tests with Playwright)
- **Accessibility-first** design with a11y tooling and testing
- **Type-safe development** with TypeScript strict mode
- **Modern Svelte 5** with Runes for universal reactivity
- **Enterprise architecture** with clear separation of concerns

## Architecture Philosophy

The project follows **Domain-Driven Design (DDD)** principles with a focus on:

### Core Principles

1. **Contract-First Development**: Define TypeScript interfaces before implementation
2. **Screaming Architecture**: Directory structure reflects business domains, not technical layers
3. **Logic Externalization**: UI components only render, business logic lives in Services
4. **Anti-Corruption Layer**: Repository pattern isolates data access from business logic

### Design Goals

- **Scalability**: Easy to add new features and domains
- **Testability**: Business logic isolated in testable Service classes
- **Maintainability**: Clear boundaries and responsibilities
- **Type Safety**: Strict TypeScript, no `any` types
- **Loose Coupling**: Depend on interfaces, not implementations
- **High Cohesion**: Related code stays together in domain modules

## Target Use Cases

This architecture is ideal for:

- Large-scale web applications with multiple business domains
- Projects requiring high maintainability and testability
- Teams that value clear separation of concerns
- Applications with complex business logic
- Projects that need to scale over time

## Technology Decisions

### Why Svelte 5?

- Universal reactivity with Runes
- Better TypeScript integration
- Improved performance
- Cleaner component API

### Why Domain-Driven Design?

- Scales well for large applications
- Clear boundaries between domains
- Easy to understand business logic
- Supports team collaboration

### Why Repository Pattern?

- Isolates data access from business logic
- Easy to swap implementations (HTTP, Mock, Local)
- Testable without real API calls
- Supports offline mode and caching
