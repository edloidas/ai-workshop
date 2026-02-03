# ai-workshop

React 19 workshop/presentation. TypeScript, Vite, Tailwind CSS v4, Framer Motion, Bun.

## Commands

```bash
bun dev       # Dev server
bun build     # Production build
bun preview   # Preview production build
bun check:fix # Typecheck + lint + format (with fixes)
bun check     # Typecheck + lint + format (read-only)
```

Individual: `typecheck`, `lint`, `lint:fix`, `format`, `format:check`

## Constraints

- React 19 with react-jsx transform
- ES2022 target
- Biome (single quotes, trailing commas, semicolons)
- Tailwind CSS v4

## Commenting Rules

Special prefixes (Better Comments extension):
- `// !` - Critical issues (red)
- `// ?` - Questions/rationale (blue)
- `// *` - Section headers (green) - surround with blank comment lines
- `// TODO:` - Actionable future work (orange)

Guidelines: Comment non-obvious logic only. Update/delete stale comments. No nested ternaries.

JSX comments must use `{/* comment */}` syntax.

## External Docs

Use Context7 MCP for documentation on any library (React, Tailwind, Framer Motion, Vite, etc.).
Request specific topics, not full manuals.

For research tasks, use `docs-finder` skill to search documentation effectively.

## Skills

- `/react-review` - Audit React component patterns
- `/typescript-review` - Audit TypeScript code style
