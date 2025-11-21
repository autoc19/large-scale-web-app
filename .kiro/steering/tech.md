# Tech Stack

## Core Framework

- **Svelte 5** with Runes (universal reactivity system)
- **SvelteKit 2.0** for full-stack framework
- **TypeScript 5.9+** with strict mode enabled
- **Vite 7** as build tool

## Styling & UI

- **Tailwind CSS 4** with official plugins (@tailwindcss/forms, @tailwindcss/typography)
- **Storybook 10** for component development and documentation
- Accessibility testing via @storybook/addon-a11y

## Testing

- **Vitest 4** for unit and integration tests
- **Playwright** for E2E testing
- Browser testing with @vitest/browser-playwright
- Separate test configurations for client and server code

## Internationalization

- **Paraglide JS** (@inlang/paraglide-js) for i18n
- Supported locales: en, zh-tw, jp
- Message files in `messages/` directory

## Code Quality

- **ESLint 9** with TypeScript and Svelte plugins
- **Prettier 3** with Svelte and Tailwind plugins
- Strict TypeScript configuration

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run dev -- --open    # Start dev server and open browser

# Building
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm run test             # Run all tests (unit + E2E)
npm run test:unit        # Run unit tests with Vitest
npm run test:e2e         # Run E2E tests with Playwright

# Code Quality
npm run check            # Type-check with svelte-check
npm run check:watch      # Type-check in watch mode
npm run lint             # Run ESLint and Prettier checks
npm run format           # Format code with Prettier

# Storybook
npm run storybook        # Start Storybook dev server (port 6006)
npm run build-storybook  # Build Storybook for production
```

## Additional Libraries (Recommended)

### Form Handling

- **sveltekit-superforms** with **zod** for type-safe form validation
- Install: `npm install sveltekit-superforms zod`

### Path Aliases

Configure in `svelte.config.js`:

```javascript
kit: {
    alias: {
        '$core': 'src/lib/core',
        '$ui': 'src/lib/ui',
        '$domains': 'src/lib/domains',
        '$config': 'src/lib/config',
        '$server': 'src/lib/server',
        '$paraglide': 'src/lib/paraglide'
    }
}
```

## Important Notes

- **SSR Compatibility**: Use `fetch` from SvelteKit load functions for SSR-compatible requests
- **Test Projects**: Vitest has two test projects configured:
  - `client`: Browser tests for `*.svelte.{test,spec}.{js,ts}` files
  - `server`: Node tests for `*.{test,spec}.{js,ts}` files (excluding .svelte tests)
- **Svelte 5 Runes**: This project uses Svelte 5 with Runes ($state, $props, $derived, $effect)
- **No Slots**: Use Snippets instead of Slots for component composition
- **Strict TypeScript**: All strict checks enabled, no `any` types allowed
