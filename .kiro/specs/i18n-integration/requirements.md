# Requirements Document

## Introduction

This specification defines the internationalization (i18n) integration using Paraglide JS, enabling the application to support multiple languages (English, Traditional Chinese, Japanese) with type-safe message access and automatic language detection.

## Glossary

- **Paraglide JS**: Type-safe i18n library for SvelteKit
- **Locale**: A language/region combination (e.g., en, zh-tw, jp)
- **Message**: A translatable text string with optional parameters
- **Base Locale**: The default language (English)
- **Message Format**: The structure for defining translatable strings with placeholders

## Requirements

### Requirement 1: Paraglide Configuration

**User Story:** As a developer, I want Paraglide JS properly configured, so that I can use type-safe translations throughout the application.

#### Acceptance Criteria

1. WHEN Paraglide is configured THEN the System SHALL support three locales: en, zh-tw, and jp
2. WHEN Paraglide is configured THEN the System SHALL set English (en) as the base locale
3. WHEN Paraglide is configured THEN the System SHALL generate TypeScript types for all messages
4. WHEN Paraglide is configured THEN the System SHALL output generated code to `src/lib/paraglide/`
5. WHEN Paraglide is configured THEN the System SHALL use the message format plugin for parameter interpolation

### Requirement 2: Message File Structure

**User Story:** As a developer, I want organized message files for each locale, so that I can easily manage translations and add new languages.

#### Acceptance Criteria

1. WHEN message files are created THEN the System SHALL store them in the `messages/` directory
2. WHEN message files are created THEN the System SHALL name them by locale code (en.json, zh-tw.json, jp.json)
3. WHEN message files are created THEN the System SHALL include the inlang schema reference
4. WHEN messages are defined THEN the System SHALL support parameter interpolation with curly braces
5. WHEN messages are defined THEN the System SHALL use consistent keys across all locale files

### Requirement 3: Message Usage in Components

**User Story:** As a developer, I want to use translated messages in components with full TypeScript support, so that I can build multilingual UIs with confidence.

#### Acceptance Criteria

1. WHEN importing messages THEN the System SHALL provide a typed messages module from `$paraglide/messages`
2. WHEN using messages THEN the System SHALL provide autocomplete for all message keys
3. WHEN using messages with parameters THEN the System SHALL enforce parameter types at compile time
4. WHEN using messages THEN the System SHALL automatically use the current locale
5. WHEN a message key is missing THEN the System SHALL show a TypeScript error at compile time

### Requirement 4: Common Application Messages

**User Story:** As a user, I want the application interface in my preferred language, so that I can understand and use the application effectively.

#### Acceptance Criteria

1. WHEN the application displays common UI text THEN the System SHALL provide translations for buttons (save, cancel, delete, edit)
2. WHEN the application displays common UI text THEN the System SHALL provide translations for form labels and placeholders
3. WHEN the application displays validation errors THEN the System SHALL provide translated error messages
4. WHEN the application displays status messages THEN the System SHALL provide translations for loading, success, and error states
5. WHEN the application displays navigation THEN the System SHALL provide translations for menu items and page titles

### Requirement 5: Todo Domain Messages

**User Story:** As a user, I want todo-related text in my preferred language, so that I can manage my tasks in a familiar language.

#### Acceptance Criteria

1. WHEN displaying todo items THEN the System SHALL provide translations for "completed", "pending", "all todos"
2. WHEN displaying todo forms THEN the System SHALL provide translations for "add todo", "edit todo", "todo title"
3. WHEN displaying todo actions THEN the System SHALL provide translations for "mark complete", "mark incomplete", "delete todo"
4. WHEN displaying todo counts THEN the System SHALL provide translations with parameter support for counts
5. WHEN displaying todo validation THEN the System SHALL provide translated validation error messages

### Requirement 6: Language Switching

**User Story:** As a user, I want to switch between languages, so that I can use the application in my preferred language.

#### Acceptance Criteria

1. WHEN a language selector is rendered THEN the System SHALL display all available locales
2. WHEN a user selects a language THEN the System SHALL update the current locale
3. WHEN the locale changes THEN the System SHALL re-render all components with new translations
4. WHEN the locale changes THEN the System SHALL persist the preference (localStorage or cookie)
5. WHEN the application loads THEN the System SHALL detect the user's preferred language from browser settings

### Requirement 7: Pluralization Support

**User Story:** As a developer, I want proper pluralization rules for different languages, so that messages display correctly based on quantity.

#### Acceptance Criteria

1. WHEN displaying counts THEN the System SHALL use correct plural forms for each language
2. WHEN English messages use plurals THEN the System SHALL support singular and plural forms
3. WHEN Chinese messages use plurals THEN the System SHALL handle Chinese pluralization rules
4. WHEN Japanese messages use plurals THEN the System SHALL handle Japanese pluralization rules
5. WHEN zero items exist THEN the System SHALL display appropriate zero-case messages

### Requirement 8: Date and Number Formatting

**User Story:** As a user, I want dates and numbers formatted according to my locale, so that information is displayed in a familiar format.

#### Acceptance Criteria

1. WHEN displaying dates THEN the System SHALL format them according to the current locale
2. WHEN displaying numbers THEN the System SHALL format them according to the current locale
3. WHEN displaying currency THEN the System SHALL format it according to the current locale
4. WHEN displaying times THEN the System SHALL use 12-hour or 24-hour format based on locale
5. WHEN displaying relative times THEN the System SHALL use locale-appropriate phrases (e.g., "2 days ago")

### Requirement 9: Missing Translation Handling

**User Story:** As a developer, I want graceful handling of missing translations, so that the application remains functional even with incomplete translations.

#### Acceptance Criteria

1. WHEN a translation is missing THEN the System SHALL fall back to the base locale (English)
2. WHEN a translation is missing THEN the System SHALL log a warning in development mode
3. WHEN a translation is missing THEN the System SHALL NOT crash the application
4. WHEN a translation is missing THEN the System SHALL display the message key as a last resort
5. WHEN translations are incomplete THEN the System SHALL provide a report of missing keys

### Requirement 10: Build-time Translation Validation

**User Story:** As a developer, I want translation validation at build time, so that I can catch missing or incorrect translations before deployment.

#### Acceptance Criteria

1. WHEN the application builds THEN the System SHALL validate all message files against the schema
2. WHEN the application builds THEN the System SHALL verify all locales have the same message keys
3. WHEN the application builds THEN the System SHALL check for unused message keys
4. WHEN the application builds THEN the System SHALL verify parameter consistency across locales
5. WHEN translation errors exist THEN the System SHALL fail the build with descriptive error messages
