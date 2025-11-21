# Steering Documentation Index

This directory contains comprehensive guidance for developing in this SvelteKit project. These documents are automatically included in AI assistant context to ensure consistent development practices.

## Quick Reference

### For New Developers

1. Start with [Product Overview](./product.md) to understand the project vision
2. Read [Architecture Principles](./architecture-principles.md) to grasp core concepts
3. Review [Project Structure](./structure.md) to understand organization
4. Follow [Development Workflow](./development-workflow.md) when building features

### For Experienced Developers

- [Svelte 5 Syntax](./svelte5-syntax.md) - **MANDATORY** Svelte 5 rules (NO Svelte 4 syntax)
- [Coding Standards](./coding-standards.md) - Quick reference for conventions
- [Critical Patterns](./critical-patterns.md) - Common patterns and pitfalls
- [Tech Stack](./tech.md) - Commands and configuration

## Document Overview

### [product.md](./product.md)

**Purpose**: High-level project overview and vision

**Contains**:

- Project vision and goals
- Key features
- Architecture philosophy
- Technology decisions and rationale

**When to read**: First time working on the project, or when making architectural decisions

---

### [architecture-principles.md](./architecture-principles.md)

**Purpose**: Core architectural patterns and design principles

**Contains**:

- Four core principles (Contract-First, Screaming Architecture, Logic Externalization, Anti-Corruption Layer)
- Layered architecture explanation
- Separation of concerns guidelines
- Critical patterns ($effect sync, Repository, Service, DI)
- Design goals

**When to read**: Before implementing any feature, when making design decisions

---

### [structure.md](./structure.md)

**Purpose**: Project organization and file structure

**Contains**:

- Complete directory structure
- File naming conventions
- Svelte 5 Runes usage
- Component architecture layers
- Dependency injection patterns
- Data flow patterns
- Environment variable handling
- Testing strategy
- Path aliases

**When to read**: When creating new files or organizing code

---

### [coding-standards.md](./coding-standards.md)

**Purpose**: Detailed coding conventions and standards

**Contains**:

- TypeScript standards (type safety, naming)
- Svelte 5 Runes usage patterns
- Component standards
- File organization and naming
- Import order conventions
- Environment variable patterns
- Form handling with Superforms + Zod
- Error handling standards
- Testing standards
- Code style and formatting
- Internationalization patterns

**When to read**: Daily reference while coding, during code reviews

---

### [development-workflow.md](./development-workflow.md)

**Purpose**: Step-by-step guide for feature development

**Contains**:

- Complete feature development process (7 phases)
- Pre-commit checklist
- Common development commands
- Debugging tips
- Git workflow
- Code review guidelines

**When to read**: When starting a new feature, when stuck on implementation

---

### [critical-patterns.md](./critical-patterns.md)

**Purpose**: Essential patterns and common mistakes to avoid

**Contains**:

- $effect data sync pattern (CRITICAL)
- Repository pattern with examples
- Service pattern with Runes
- Dependency injection pattern
- Form handling complete pattern
- Environment configuration pattern
- Common pitfalls and solutions
- Performance patterns

**When to read**: Before implementing pages, services, or repositories; when debugging issues

---

### [svelte5-syntax.md](./svelte5-syntax.md)

**Purpose**: 🔴 MANDATORY Svelte 5 syntax rules

**Contains**:

- Forbidden Svelte 4 patterns (export let, <slot>, on:, $:, etc.)
- Correct Svelte 5 patterns ($props, Snippets, onclick, $derived, $effect)
- Standard component template
- Migration checklist
- Common mistakes and solutions

**When to read**: **ALWAYS** - Before writing any Svelte code, during code review

---

### [tech.md](./tech.md)

**Purpose**: Technical stack and tooling reference

**Contains**:

- Core framework versions
- Styling and UI tools
- Testing setup
- Internationalization
- Code quality tools
- Common commands
- Important notes

**When to read**: When setting up environment, running commands, or configuring tools

---

## Quick Decision Tree

### "I'm implementing a new feature"

1. **FIRST**: Read [Svelte 5 Syntax](./svelte5-syntax.md) - Mandatory rules
2. Read [Development Workflow](./development-workflow.md) - Phase 1-7
3. Reference [Architecture Principles](./architecture-principles.md) for patterns
4. Check [Coding Standards](./coding-standards.md) for conventions
5. Review [Critical Patterns](./critical-patterns.md) for $effect sync

### "I'm creating a new component"

1. **FIRST**: Read [Svelte 5 Syntax](./svelte5-syntax.md) - NO export let, NO <slot>, NO on:
2. Check [Structure](./structure.md) - File naming and location
3. Review [Coding Standards](./coding-standards.md) - Component standards
4. Use [Critical Patterns](./critical-patterns.md) - Snippet pattern

### "I'm adding a new domain"

1. Review [Architecture Principles](./architecture-principles.md) - Domain Layer
2. Follow [Structure](./structure.md) - Domain directory structure
3. Use [Development Workflow](./development-workflow.md) - Phase 1-6

### "I'm writing a form"

1. Check [Critical Patterns](./critical-patterns.md) - Form handling pattern
2. Review [Coding Standards](./coding-standards.md) - Superforms + Zod

### "I'm debugging an issue"

1. Check [Critical Patterns](./critical-patterns.md) - Common pitfalls
2. Review [Development Workflow](./development-workflow.md) - Debugging tips
3. Verify [Coding Standards](./coding-standards.md) - Error handling

### "I'm doing code review"

1. **FIRST**: Verify [Svelte 5 Syntax](./svelte5-syntax.md) compliance - NO Svelte 4 patterns
2. Use [Development Workflow](./development-workflow.md) - Pre-commit checklist
3. Verify [Architecture Principles](./architecture-principles.md) compliance
4. Check [Coding Standards](./coding-standards.md) adherence

## Key Concepts Summary

### The Four Pillars

1. **Contract-First**: Interfaces before implementation
2. **Screaming Architecture**: Organize by domain, not technology
3. **Logic Externalization**: UI renders, Services contain logic
4. **Anti-Corruption Layer**: Repository pattern for data access

### The Critical Pattern

**Always use `$effect` to sync Service state with route data in pages**

```svelte
<script lang="ts">
	interface Props {
		data: { items: TodoItem[] };
	}

	let { data }: Props = $props();
	const service = new TodoService(repo, data.items);
	setContext(TODO_SERVICE_KEY, service);

	// CRITICAL: Sync when route data changes
	$effect(() => {
		service.items = data.items;
	});
</script>
```

### Svelte 5 Syntax Rules

**FORBIDDEN Svelte 4 patterns** (see [svelte5-syntax.md](./svelte5-syntax.md)):

- ❌ NO `export let` - Use `$props()` instead
- ❌ NO `<slot>` - Use `{@render children()}` instead
- ❌ NO `on:` directive - Use `onclick` instead
- ❌ NO `$:` reactive - Use `$derived` or `$effect` instead
- ❌ NO `createEventDispatcher` - Use callback props instead

### The Layer Stack

```
Routes (Glue) → Services (Logic) → Repositories (Data) → API
     ↓
Components (UI) → UI Primitives (Design System)
```

### The File Structure Pattern

```
domains/[domain]/
├── components/     # Domain UI
├── models/         # Types & Schemas
├── services/       # Business Logic
└── repositories/   # Data Access
```

## Maintenance

These steering documents should be updated when:

- Architecture patterns change
- New conventions are established
- Common issues are discovered
- Technology stack is upgraded
- Best practices evolve

## Contributing

When updating steering documents:

1. Keep them concise and actionable
2. Include code examples
3. Explain the "why" not just the "what"
4. Update this index if adding new documents
5. Cross-reference related documents
