# Storybook Documentation

This document provides guidance on using Storybook for component development and documentation.

## Overview

Storybook is an isolated development environment for UI components. It allows you to:

- Develop components in isolation
- Document component usage
- Test component states
- Verify accessibility
- Create a living component library

## Running Storybook

```bash
# Start Storybook dev server (port 6006)
npm run storybook

# Build Storybook for production
npm run build-storybook
```

## Component Stories

### Button Component

**Location:** `src/lib/ui/primitives/Button.stories.svelte`

**Stories:**
- Primary variant
- Secondary variant
- Danger variant
- Small size
- Medium size
- Large size
- Disabled state
- Submit button
- Reset button

**Usage:**
```svelte
<Button variant="primary" size="md">Click me</Button>
```

### Input Component

**Location:** `src/lib/ui/primitives/Input.stories.svelte`

**Stories:**
- Text input
- Email input
- Password input
- Number input
- Telephone input
- URL input
- With label
- With error
- Required field
- Disabled state

**Usage:**
```svelte
<Input type="email" label="Email" bind:value={email} />
```

### Modal Component

**Location:** `src/lib/ui/primitives/Modal.stories.svelte`

**Stories:**
- Small modal
- Medium modal
- Large modal
- Extra large modal
- With header
- With footer
- With header and footer
- Closed state
- Accessible modal

**Usage:**
```svelte
<Modal bind:open={isOpen} header={() => 'Title'}>
  Content
</Modal>
```

## Writing Stories

### Basic Story Structure

```svelte
<script lang="ts">
  import Component from './Component.svelte';
  import type { Meta, StoryObj } from '@storybook/svelte';

  const meta = {
    title: 'UI/Primitives/Component',
    component: Component,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: 'select',
        options: ['primary', 'secondary']
      }
    }
  } satisfies Meta<Component>;

  export default meta;
  type Story = StoryObj<typeof meta>;

  export const Primary: Story = {
    args: {
      variant: 'primary',
      children: () => 'Button'
    }
  };
</script>
```

### Story Best Practices

1. **One story per state/variant**
   - Create separate stories for each variant
   - Create separate stories for each size
   - Create separate stories for each state (disabled, error, etc.)

2. **Descriptive names**
   - Use clear, descriptive story names
   - Avoid generic names like "Default" or "Example"
   - Use names that describe the state or variant

3. **Realistic content**
   - Use realistic content in stories
   - Avoid placeholder text like "Lorem ipsum"
   - Show how components look with real data

4. **Document usage**
   - Add comments explaining the story
   - Document any special props or configurations
   - Show common use cases

## Accessibility Testing

### Using the Accessibility Addon

Storybook includes the `@storybook/addon-a11y` addon for accessibility testing.

**Features:**
- Automated accessibility checks
- ARIA attribute validation
- Color contrast verification
- Keyboard navigation testing

**How to use:**
1. Open a story in Storybook
2. Click the "Accessibility" tab
3. Review any violations or warnings
4. Fix issues in the component

### Accessibility Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Color contrast meets WCAG AA standards
- [ ] ARIA labels are present where needed
- [ ] Focus indicators are visible
- [ ] Semantic HTML is used
- [ ] Error messages are associated with inputs
- [ ] Form labels are properly associated with inputs

## Design Tokens

### Colors

**Primary Colors:**
- Primary: `bg-blue-600`
- Secondary: `bg-gray-600`
- Danger: `bg-red-600`

**Neutral Colors:**
- Background: `bg-white`
- Surface: `bg-gray-50`
- Border: `border-gray-300`
- Text: `text-gray-900`

### Typography

**Font Sizes:**
- Small: `text-sm`
- Base: `text-base`
- Large: `text-lg`
- XL: `text-xl`
- 2XL: `text-2xl`

**Font Weights:**
- Regular: `font-normal`
- Medium: `font-medium`
- Semibold: `font-semibold`
- Bold: `font-bold`

### Spacing

**Scale:**
- 1: `0.25rem` (4px)
- 2: `0.5rem` (8px)
- 3: `0.75rem` (12px)
- 4: `1rem` (16px)
- 6: `1.5rem` (24px)
- 8: `2rem` (32px)

### Border Radius

- Small: `rounded`
- Medium: `rounded-md`
- Large: `rounded-lg`
- Full: `rounded-full`

## Component Documentation

### MDX Documentation

You can add MDX documentation files for components:

```mdx
# Button Component

The Button component is a reusable button with multiple variants and sizes.

## Usage

\`\`\`svelte
<Button variant="primary">Click me</Button>
\`\`\`

## Props

- `variant`: 'primary' | 'secondary' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `type`: 'button' | 'submit' | 'reset'

## Accessibility

The Button component includes:
- Proper ARIA attributes
- Keyboard navigation support
- Focus indicators
- Disabled state styling
```

## Testing Components in Storybook

### Visual Testing

1. Open a story in Storybook
2. Verify the component renders correctly
3. Check all variants and states
4. Verify responsive behavior

### Interaction Testing

1. Click buttons and interactive elements
2. Test form inputs
3. Test modal open/close
4. Verify event handlers work

### Accessibility Testing

1. Use the Accessibility addon
2. Test keyboard navigation
3. Verify color contrast
4. Check ARIA attributes

## Storybook Configuration

### Main Configuration

**File:** `.storybook/main.ts`

```typescript
import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.svelte'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {}
  }
};

export default config;
```

### Preview Configuration

**File:** `.storybook/preview.ts`

```typescript
import type { Preview } from '@storybook/svelte';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
```

## Best Practices

### 1. Keep Stories Simple

✅ **DO:**
```svelte
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: () => 'Button'
  }
};
```

❌ **DON'T:**
```svelte
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: () => 'Button',
    onclick: () => console.log('clicked'),
    class: 'custom-class',
    // ... many other props
  }
};
```

### 2. Use Descriptive Names

✅ **DO:**
```svelte
export const PrimaryLarge: Story = { ... };
export const DangerDisabled: Story = { ... };
export const WithError: Story = { ... };
```

❌ **DON'T:**
```svelte
export const Story1: Story = { ... };
export const Story2: Story = { ... };
export const Test: Story = { ... };
```

### 3. Document Accessibility

✅ **DO:**
```svelte
export const Accessible: Story = {
  args: {
    // Component with proper ARIA attributes
  }
};
```

❌ **DON'T:**
```svelte
export const Default: Story = {
  args: {
    // No accessibility considerations
  }
};
```

### 4. Test All States

✅ **DO:**
```svelte
export const Enabled: Story = { ... };
export const Disabled: Story = { ... };
export const Loading: Story = { ... };
export const Error: Story = { ... };
```

❌ **DON'T:**
```svelte
export const Default: Story = { ... };
```

## Troubleshooting

### Stories Not Appearing

**Problem:** Stories don't show up in Storybook

**Solution:**
1. Check file naming: `*.stories.svelte`
2. Verify story export: `export default meta`
3. Check Storybook configuration
4. Restart Storybook dev server

### Components Not Rendering

**Problem:** Component doesn't render in story

**Solution:**
1. Check component imports
2. Verify all required props are provided
3. Check for TypeScript errors
4. Review browser console for errors

### Styling Issues

**Problem:** Component styling looks different in Storybook

**Solution:**
1. Verify Tailwind CSS is configured
2. Check for CSS conflicts
3. Verify component classes are correct
4. Check Storybook preview configuration

## Additional Resources

- [Storybook Documentation](https://storybook.js.org)
- [Storybook for Svelte](https://storybook.js.org/docs/svelte/get-started/introduction)
- [Accessibility Addon](https://storybook.js.org/docs/svelte/essentials/accessibility-testing)
- [Component Story Format](https://storybook.js.org/docs/svelte/api/csf)
