# Design Document

## Overview

The About page domain module provides a comprehensive informational page displaying project details, technology stack, architecture principles, and team information. This module demonstrates the DDD architecture with static content management, proper i18n integration, and responsive design patterns.

The module follows the established architectural patterns:
- **Repository Pattern**: Abstracts content loading with swappable implementations
- **Service Pattern**: Manages state using Svelte 5 Runes with derived computations
- **Component Pattern**: Domain-specific UI components consuming service via context
- **$effect Sync Pattern**: Ensures state synchronization during navigation

## Architecture

### Layer Structure

```
src/lib/domains/about/
├── models/
│   └── about.types.ts          # TypeScript interfaces for all data structures
├── repositories/
│   ├── about.repository.ts     # Repository interface
│   └── about.repository.static.ts  # Static content implementation
├── services/
│   └── about.service.svelte.ts # Business logic with Runes
└── components/
    ├── AboutHero.svelte        # Hero section with project info
    ├── TechnologyStack.svelte  # Technology grid display
    ├── ArchitectureSection.svelte  # Architecture principles
    └── TeamSection.svelte      # Team member cards

src/routes/about/
├── +page.ts                    # Data loading
└── +page.svelte                # Page assembly with DI
```

### Data Flow

1. **Load Phase**: `+page.ts` instantiates repository and fetches all content
2. **Initialization**: `+page.svelte` creates service with initial data and injects into context
3. **Synchronization**: `$effect` keeps service state aligned with route data
4. **Rendering**: Domain components retrieve service from context and bind to state
5. **Reactivity**: Svelte 5 Runes provide automatic UI updates

## Components and Interfaces

### Data Models

**AboutInfo Interface**:
```typescript
interface AboutInfo {
  projectName: string;
  description: string;
  version: string;
  repository?: string;
  license?: string;
}
```

**TechnologyItem Interface**:
```typescript
interface TechnologyItem {
  name: string;
  category: 'framework' | 'language' | 'testing' | 'styling' | 'tooling';
  description: string;
  version?: string;
  url?: string;
}
```

**ArchitecturePrinciple Interface**:
```typescript
interface ArchitecturePrinciple {
  id: string;
  title: string;
  description: string;
  icon: string;
  examples?: string[];
}
```

**TeamMember Interface**:
```typescript
interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
  email?: string;
  github?: string;
}
```

### Repository Layer

**Interface** (`about.repository.ts`):
```typescript
export interface AboutRepository {
  getAboutInfo(): Promise<AboutInfo>;
  getTechnologies(): Promise<TechnologyItem[]>;
  getArchitecturePrinciples(): Promise<ArchitecturePrinciple[]>;
  getTeamMembers(): Promise<TeamMember[]>;
}
```

**Static Implementation** (`about.repository.static.ts`):
- Returns hardcoded content matching project documentation
- Simulates async behavior with Promise.resolve()
- Provides realistic data for all sections
- Supports future extension to CMS or API

### Service Layer

**AboutService** (`about.service.svelte.ts`):
```typescript
export class AboutService {
  // State
  aboutInfo = $state<AboutInfo | null>(null);
  technologies = $state<TechnologyItem[]>([]);
  principles = $state<ArchitecturePrinciple[]>([]);
  teamMembers = $state<TeamMember[]>([]);
  loading = $state(false);
  error = $state<string | null>(null);

  // Derived state
  get technologiesByCategory() {
    // Groups technologies by category
  }

  get teamMemberCount() {
    return this.teamMembers.length;
  }

  constructor(private repo: AboutRepository, initialData?) {
    // Initialize with provided data
  }

  async loadAllContent() {
    // Loads all content with proper error handling
  }
}
```

### UI Components

**AboutHero.svelte**:
- Displays project name, description, and version
- Shows repository link and license information
- Uses large typography for visual hierarchy
- Responsive padding and spacing

**TechnologyStack.svelte**:
- Groups technologies by category
- Displays in responsive grid (1/2/3 columns)
- Shows technology name, version, and description
- Links to official documentation

**ArchitectureSection.svelte**:
- Displays each principle as a card
- Shows icon, title, and description
- Optionally displays code examples
- Uses consistent card styling

**TeamSection.svelte**:
- Displays team members in grid layout
- Shows avatar, name, and role
- Handles optional contact information
- Links to GitHub profiles when available

## Data Models

### Type Definitions

All interfaces are defined in `models/about.types.ts` with:
- Strict TypeScript types (no `any`)
- Optional properties marked with `?`
- Union types for category enums
- JSDoc comments for documentation

### Data Structure

```typescript
// Complete data structure returned by repository
interface AboutPageData {
  aboutInfo: AboutInfo;
  technologies: TechnologyItem[];
  principles: ArchitecturePrinciple[];
  teamMembers: TeamMember[];
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Repository data structure conformance
*For any* repository method call, the returned data should match the defined TypeScript interface structure with all required fields present
**Validates: Requirements 2.2**

### Property 2: Service loading state transitions
*For any* service load operation, the loading state should transition from false to true at start, and back to false upon completion or error
**Validates: Requirements 3.4**

### Property 3: Service error handling
*For any* repository error, the service should catch it, set the error state with the error message, and NOT throw the error
**Validates: Requirements 3.5**

### Property 4: Technology grouping by category
*For any* set of technologies, the service's technologiesByCategory getter should correctly group all items by their category property
**Validates: Requirements 3.6**

### Property 5: Team member count accuracy
*For any* set of team members, the service's teamMemberCount getter should return the exact count of items in the teamMembers array
**Validates: Requirements 3.7**

### Property 6: Technology display completeness
*For any* set of technologies, the TechnologyStack component should display all technologies grouped by category with no items missing
**Validates: Requirements 4.2**

### Property 7: Architecture principle display completeness
*For any* set of architecture principles, the ArchitectureSection component should display all required fields (title, description, icon) for each principle
**Validates: Requirements 4.4**

### Property 8: Service state synchronization
*For any* change in route data, the $effect hook should update the service state properties to match the new data values
**Validates: Requirements 5.5**

### Property 9: Heading hierarchy validity
*For any* rendered page, heading elements should follow proper hierarchy without skipping levels (h1 -> h2 -> h3, never h1 -> h3)
**Validates: Requirements 8.3, 9.5**

### Property 10: Semantic HTML structure
*For any* rendered page, the HTML should use proper semantic elements (header, main, section, article) in appropriate contexts
**Validates: Requirements 8.5, 9.1**

### Property 11: Image accessibility
*For any* image element in the rendered output, it should have an alt attribute with non-empty descriptive text
**Validates: Requirements 9.2**

### Property 12: Keyboard navigation support
*For any* interactive element, it should be keyboard accessible with proper tabindex and focus management
**Validates: Requirements 9.3**

## Error Handling

### Repository Layer
- Throws standard Error objects with descriptive messages
- No error catching at this layer
- Errors bubble up to service layer

### Service Layer
- Catches all repository errors
- Sets `error` state with user-friendly message
- Sets `loading` to false in finally block
- Never throws errors to UI layer
- Logs errors to console in development mode

### UI Layer
- Displays `service.error` in styled error component
- Shows loading states during async operations
- Gracefully handles missing optional data
- Provides fallback content when data is unavailable

### Error Scenarios

1. **Repository Error**: Service catches, sets error state, displays message
2. **Missing Data**: Components handle null/undefined with conditional rendering
3. **Invalid Data**: TypeScript prevents at compile time
4. **Network Issues**: Not applicable (static content)

## Testing Strategy

### Unit Testing

**Service Tests** (`about.service.test.ts`):
- Test state initialization with initial data
- Test loading state transitions
- Test error handling and error state
- Test derived getters (technologiesByCategory, teamMemberCount)
- Mock repository with vi.fn()
- Use Vitest with describe/it/expect

**Repository Tests** (`about.repository.static.test.ts`):
- Test each method returns correct data structure
- Test data matches TypeScript interfaces
- Test all required fields are present
- Verify async behavior with Promise

### Property-Based Testing

**Framework**: fast-check (JavaScript property testing library)
**Configuration**: Minimum 100 iterations per property

**Service Property Tests** (`about.service.property.test.ts`):
- Property 2: Loading state transitions
- Property 3: Error handling behavior
- Property 4: Technology grouping correctness
- Property 5: Team member count accuracy
- Property 8: State synchronization

**Component Property Tests** (`*.property.svelte.test.ts`):
- Property 6: Technology display completeness
- Property 7: Architecture principle display
- Property 9: Heading hierarchy validation
- Property 10: Semantic HTML structure
- Property 11: Image alt text presence
- Property 12: Keyboard navigation

### Component Testing

**Vitest Browser Mode** (`*.svelte.test.ts`):
- Test component rendering with mock service
- Test context injection and retrieval
- Test conditional rendering of optional data
- Test responsive class application
- Test i18n message usage

### Integration Testing

**Page Integration** (`+page.svelte.test.ts`):
- Test complete data flow from load to render
- Test $effect synchronization
- Test error display
- Test service injection into context

### E2E Testing

**Playwright** (`e2e/about.test.ts`):
- Navigate to /about page
- Verify all sections are visible
- Test responsive layout at different viewports
- Verify links are clickable
- Test language switching

### Test Coverage Goals

- Service logic: 100% (critical business logic)
- Components: 80% (focus on logic, not styling)
- Repository: 100% (simple, easy to test)
- Integration: Key user flows
- E2E: Happy path and error scenarios

## Internationalization

### Message Keys

**Section Headings**:
- `about.title`: "About"
- `about.technology_stack`: "Technology Stack"
- `about.architecture`: "Architecture Principles"
- `about.team`: "Our Team"

**Project Information**:
- `about.project_name`: Project name
- `about.project_description`: Full description
- `about.version`: "Version {version}"

**Technology Categories**:
- `about.category.framework`: "Framework"
- `about.category.language`: "Language"
- `about.category.testing`: "Testing"
- `about.category.styling`: "Styling"
- `about.category.tooling`: "Tooling"

**Architecture Principles**:
- `about.principle.contract_first.title`: "Contract-First Development"
- `about.principle.contract_first.description`: Description text
- `about.principle.screaming_architecture.title`: "Screaming Architecture"
- (etc. for all principles)

**Team Roles**:
- `about.role.lead_developer`: "Lead Developer"
- `about.role.frontend_developer`: "Frontend Developer"
- `about.role.backend_developer`: "Backend Developer"
- `about.role.designer`: "Designer"

### Translation Files

All messages defined in:
- `messages/en.json`
- `messages/zh-tw.json`
- `messages/jp.json`

### Usage Pattern

```svelte
<script>
  import * as m from '$paraglide/messages';
</script>

<h1>{m.about_title()}</h1>
<p>{m.about_project_description()}</p>
<span>{m.about_version({ version: '1.0.0' })}</span>
```

## Performance Considerations

### Static Content Strategy
- All content loaded at build time
- No external API calls required
- Fast initial page load
- Pre-rendered HTML for SEO

### Optimization Techniques
- Lazy load images below the fold
- Use responsive images with srcset
- Minimize JavaScript bundle size
- Leverage SvelteKit's code splitting

### Loading States
- Show skeleton UI during initial load (if needed)
- Minimal layout shift with proper sizing
- Smooth transitions between states

## Accessibility

### Semantic HTML
- Use `<header>` for page header
- Use `<main>` for main content
- Use `<section>` for each content section
- Use `<article>` for team member cards

### ARIA Labels
- Add aria-label to icon-only buttons
- Use aria-describedby for additional context
- Ensure proper landmark regions

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Visible focus indicators
- Skip links for navigation

### Color Contrast
- Maintain WCAG AA standards (4.5:1 for text)
- Use Tailwind's accessible color combinations
- Test with contrast checking tools

### Screen Reader Support
- Descriptive alt text for all images
- Proper heading hierarchy
- Meaningful link text (not "click here")
- Status messages announced appropriately

## Responsive Design

### Breakpoints (Tailwind)
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md/lg)
- Desktop: > 1024px (xl)

### Layout Patterns

**Hero Section**:
- Mobile: Single column, centered text
- Tablet: Single column, larger text
- Desktop: Single column, maximum width container

**Technology Grid**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

**Architecture Cards**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

**Team Grid**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 4 columns

### Responsive Utilities
- Use Tailwind responsive prefixes (sm:, md:, lg:, xl:)
- Container with max-width and padding
- Flexible spacing with responsive classes
- Responsive typography scale

## Future Enhancements

### Potential Extensions
1. **CMS Integration**: Replace static repository with CMS-backed implementation
2. **Dynamic Content**: Load content from API for real-time updates
3. **Interactive Elements**: Add animations and transitions
4. **Social Sharing**: Add share buttons for social media
5. **Analytics**: Track page views and user interactions
6. **Search**: Add search functionality for technologies and principles
7. **Filtering**: Allow filtering technologies by category
8. **Dark Mode**: Add theme switching support

### Extensibility Points
- Repository interface allows swapping implementations
- Service layer independent of data source
- Components accept data via props for Storybook
- Modular design supports adding new sections
