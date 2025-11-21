# Translation Guide

This guide provides guidelines for translators working on the i18n project.

## Overview

The application supports three languages:
- **English (en)**: Base language
- **Traditional Chinese (zh-tw)**: Simplified Chinese not supported
- **Japanese (jp)**: Standard Japanese

## Translation Workflow

### 1. Identify New Messages

New messages are added to `messages/en.json` first. Translators should:

1. Check the English message file for new keys
2. Compare with existing translations in other locales
3. Identify missing translations
4. Translate and add to respective locale files

### 2. Translation Process

For each new message:

1. **Read the context**: Understand where and how the message is used
2. **Check for similar messages**: Look for existing translations of similar concepts
3. **Translate**: Provide accurate translation in target language
4. **Review**: Verify the translation fits the UI context
5. **Test**: Ensure the translation displays correctly in the application

### 3. Quality Assurance

Before submitting translations:

1. Verify all keys from English are present
2. Check for consistency with existing translations
3. Ensure proper formatting and punctuation
4. Test in the application UI
5. Verify parameter placeholders are preserved

## Language-Specific Guidelines

### English (Base Language)

**Principles**:
- Clear, concise, professional tone
- Use active voice
- Avoid jargon when possible
- Keep messages short for UI constraints

**Examples**:
```json
{
	"save": "Save",
	"cancel": "Cancel",
	"loading": "Loading...",
	"error_occurred": "An error occurred"
}
```

### Traditional Chinese (繁體中文)

**Principles**:
- Use Traditional Chinese characters (not Simplified)
- Formal tone appropriate for business application
- Avoid excessive punctuation
- Keep messages concise

**Character Guidelines**:
- Use 「」for quotations instead of ""
- Use ， for commas instead of ,
- Use 。for periods instead of .
- Use ： for colons instead of :

**Examples**:
```json
{
	"save": "保存",
	"cancel": "取消",
	"loading": "載入中...",
	"error_occurred": "發生錯誤"
}
```

**Pluralization**:
Chinese doesn't distinguish singular/plural forms. Use the same form for all counts:

```json
{
	"todo_count": "你有 {count} 個待辦事項"
}
```

### Japanese (日本語)

**Principles**:
- Use polite form (敬語) appropriate for business
- Mix Hiragana, Katakana, and Kanji appropriately
- Avoid excessive punctuation
- Keep messages concise

**Character Guidelines**:
- Use 「」for quotations
- Use 、for commas
- Use 。for periods
- Use ： for colons

**Examples**:
```json
{
	"save": "保存",
	"cancel": "キャンセル",
	"loading": "読み込み中...",
	"error_occurred": "エラーが発生しました"
}
```

**Pluralization**:
Japanese doesn't distinguish singular/plural forms. Use the same form for all counts:

```json
{
	"todo_count": "{count}個のTODOがあります"
}
```

## Message Categories

### Common UI Messages

**Buttons and Actions**:
```json
{
	"save": "Save",
	"cancel": "Cancel",
	"delete": "Delete",
	"edit": "Edit",
	"create": "Create",
	"update": "Update",
	"close": "Close",
	"confirm": "Confirm"
}
```

**Status Messages**:
```json
{
	"loading": "Loading...",
	"success": "Success",
	"error": "Error",
	"warning": "Warning"
}
```

**Navigation**:
```json
{
	"home": "Home",
	"settings": "Settings",
	"profile": "Profile",
	"logout": "Logout"
}
```

### Domain-Specific Messages

**Todo Domain**:
```json
{
	"todo_title": "Todo Title",
	"add_todo": "Add Todo",
	"edit_todo": "Edit Todo",
	"all_todos": "All Todos",
	"completed_todos": "Completed",
	"pending_todos": "Pending",
	"mark_complete": "Mark Complete",
	"mark_incomplete": "Mark Incomplete",
	"delete_todo": "Delete Todo"
}
```

## Handling Parameters

Messages may contain parameters that should NOT be translated:

```json
{
	"hello_world": "Hello, {name}!",
	"todo_count": "You have {count} items",
	"created_at": "Created on {date}"
}
```

**Important**: Keep parameter names exactly as they appear in English:
- `{name}` → `{name}` (not `{nom}` or `{名前}`)
- `{count}` → `{count}` (not `{nombre}` or `{数}`)
- `{date}` → `{date}` (not `{fecha}` or `{日付}`)

### Parameter Formatting

Some parameters have format specifiers:

```json
{
	"created_at": "Created on {date, date, short}",
	"price": "Price: {amount, number, currency}"
}
```

**Keep format specifiers unchanged**:
- `{date, date, short}` → `{date, date, short}`
- `{amount, number, currency}` → `{amount, number, currency}`

## Pluralization Rules

### English Pluralization

English uses `plural` syntax:

```json
{
	"todo_count": "You have {count} {count, plural, one {todo} other {todos}}"
}
```

Translation example:
```json
{
	"todo_count": "你有 {count} 個待辦事項"
}
```

### Chinese Pluralization

Chinese doesn't distinguish singular/plural. Use the same form:

```json
{
	"todo_count": "你有 {count} 個待辦事項"
}
```

### Japanese Pluralization

Japanese doesn't distinguish singular/plural. Use the same form:

```json
{
	"todo_count": "{count}個のTODOがあります"
}
```

## Context for Ambiguous Messages

Some messages may have multiple meanings. Context is provided:

```json
{
	"save": "Save",
	"save_context": "Button to save changes to a document"
}
```

**Common ambiguous terms**:

| English | Context | Chinese | Japanese |
|---------|---------|---------|----------|
| Save | Button to save | 保存 | 保存 |
| Close | Button to close | 關閉 | 閉じる |
| Delete | Button to delete | 刪除 | 削除 |
| Edit | Button to edit | 編輯 | 編集 |

## Consistency Guidelines

### Maintain Consistency Across Messages

Use the same translation for the same concept:

```json
{
	"save": "Save",
	"save_changes": "Save Changes",
	"save_file": "Save File"
}
```

All should use the same word for "save" (e.g., "保存" in Chinese).

### Check Existing Translations

Before translating a new message:

1. Search for similar messages in the locale file
2. Use the same terminology
3. Maintain consistent style and tone

### Terminology Database

Keep a list of key terms and their translations:

**English → Chinese**:
- Save → 保存
- Delete → 刪除
- Edit → 編輯
- Todo → 待辦事項
- Complete → 完成

**English → Japanese**:
- Save → 保存
- Delete → 削除
- Edit → 編集
- Todo → TODO
- Complete → 完了

## Testing Translations

### 1. Visual Testing

1. Run the application: `npm run dev`
2. Switch to the target locale
3. Verify all messages display correctly
4. Check for text overflow or formatting issues

### 2. Parameter Testing

1. Test messages with parameters
2. Verify parameters are replaced correctly
3. Check date/number formatting

### 3. Pluralization Testing

1. Test with count = 0 (zero case)
2. Test with count = 1 (singular)
3. Test with count > 1 (plural)

### 4. Length Testing

Ensure translations fit UI constraints:
- Buttons: Keep under 20 characters
- Labels: Keep under 30 characters
- Messages: Keep under 100 characters

## Common Mistakes to Avoid

### ❌ Translating Parameter Names

```json
{
	"hello": "Hello, {nom}!"  // ❌ Wrong: changed {name} to {nom}
}
```

### ✅ Keep Parameter Names

```json
{
	"hello": "Hello, {name}!"  // ✅ Correct: kept {name}
}
```

### ❌ Removing Format Specifiers

```json
{
	"date": "Created {date}"  // ❌ Wrong: removed format specifier
}
```

### ✅ Keep Format Specifiers

```json
{
	"date": "Created {date, date, short}"  // ✅ Correct: kept format
}
```

### ❌ Inconsistent Terminology

```json
{
	"save": "保存",
	"save_changes": "儲存變更"  // ❌ Wrong: different word for "save"
}
```

### ✅ Consistent Terminology

```json
{
	"save": "保存",
	"save_changes": "保存變更"  // ✅ Correct: same word for "save"
}
```

## Submission Checklist

Before submitting translations:

- [ ] All keys from English are present
- [ ] No parameter names were changed
- [ ] Format specifiers are preserved
- [ ] Terminology is consistent
- [ ] Messages fit UI constraints
- [ ] Tested in application UI
- [ ] No spelling or grammar errors
- [ ] Proper punctuation for target language
- [ ] Tone is appropriate for business context

## Resources

- [Inlang Documentation](https://inlang.com/documentation)
- [Message Format Specification](https://inlang.com/documentation/message-format)
- [Pluralization Rules](https://inlang.com/documentation/pluralization)
- [Unicode CLDR](https://cldr.unicode.org/) - Language data reference

## Contact

For questions about translations or context, contact the development team.
