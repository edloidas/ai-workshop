---
name: typescript-review
description: Audit TypeScript code for style, naming, and type definition standards
allowed-tools: Read, Glob, Grep
---

# TypeScript Code Review

Audit TypeScript code for style, naming conventions, and type definition standards. Report violations with file paths, line numbers, and suggestions.

## Invocation

`/typescript-review [file or glob]` - If no argument provided, audit all `.ts` and `.tsx` files in `src/`.

## Checklist

### Formatting (Biome enforced)
- Single quotes for strings
- Trailing commas in multi-line structures
- Semicolons required
- Spaces inside braces: `{ foo }` not `{foo}`

### Naming Conventions
- **Standalone booleans**: Use `is`/`has`/`can`/`should` prefix (`isLoading`, `hasError`)
- **Boolean props**: No prefix (`disabled`, `loading`, `visible`)
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for derived values
- **Types/Interfaces**: PascalCase
- **Functions/Variables**: camelCase

### Type Definitions
- Prefer `type` over `interface` (unless declaration merging needed)
- Use `T[]` over `Array<T>`
- Explicit return types for exported/public functions
- Use `undefined` over `null` (exception: refs initialized to `null`)
- Use `satisfies` for type-checking object literals while preserving literal types

### Type Safety
- No `any` - use `unknown` and narrow, or proper generics
- No `as` type assertions - use type guards or redesign types
- No non-null assertions (`!`) - handle undefined cases explicitly
- Avoid type assertions in general; let TypeScript infer

### Code Organization
- Import order: external packages, then internal modules, then relative imports
- Group imports by category with blank lines between groups
- Barrel exports (`index.ts`) for public APIs only

### Guard Clauses
- Use early returns for error/edge cases
- Format: condition check, then return/throw, no else needed
```typescript
// Good
if (!user) {
  return null;
}
// Continue with user...

// Bad
if (user) {
  // Long block...
} else {
  return null;
}
```

## Output Format

```
## TypeScript Review: [file path]

### Issues Found

1. **[Category]** (line X): Description
   - Current: `code snippet`
   - Suggested: `fixed code`

### Summary
- X issues found
- Files reviewed: [list]
```
