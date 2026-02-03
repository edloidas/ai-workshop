---
name: react-review
description: Audit React components for patterns, hooks usage, and best practices
allowed-tools: Read, Glob, Grep
---

# React Code Review

Audit React code for patterns, hooks, and best practices. Report violations with file paths, line numbers, and suggestions.

## Invocation

`/react-review [file or glob]` - If no argument provided, audit all `.tsx` files in `src/`.

## Checklist

### Component Structure
- Functional components only (no class components)
- Props typed with TypeScript interfaces/types
- `displayName` set for arrow function components, `memo()`, and `forwardRef()`
- Use `ComponentPropsWithoutRef<'element'>` or `ComponentPropsWithRef<'element'>` for extending native element props

### Hook Ordering
Hooks should follow this order within a component:
1. Store hooks (useContext, useStore, external state)
2. Refs (useRef)
3. State (useState)
4. Memoized values (useMemo)
5. Callbacks (useCallback)
6. Effects (useEffect, useLayoutEffect)

### useEffect Anti-patterns
Flag these misuses:
- Transforming data for rendering (should use useMemo or derive during render)
- Handling user events (should be in event handlers)
- Resetting state when props change (should use key prop or derive state)
- Subscribing in effect without cleanup function
- Missing dependencies in dependency array

### Performance
- `memo()` for components receiving object/array/function props that don't change
- `useCallback` for functions passed to memoized children or used in effect dependencies
- `useMemo` for expensive computations or referential equality
- Prefer derived state over useState + useEffect sync

### Code Style
- `className` prop should be last in destructured props
- Early returns and guard clauses for conditional rendering
- No inline object/array literals in JSX props (causes re-renders)

## Output Format

```
## React Review: [file path]

### Issues Found

1. **[Category]** (line X): Description
   - Suggestion: How to fix

### Summary
- X issues found
- Components reviewed: [list]
```
