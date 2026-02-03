---
name: commit
description: Analyze staged changes and create conventional commits with meaningful descriptions
allowed-tools: Bash, Read, Grep, AskUserQuestion
---

# Commit

Analyze staged changes and create a conventional commit with a meaningful message that explains WHY changes were made.

## Invocation

`/commit` - Analyze staged changes and create a commit.

## Commit Types

| Type       | Description                                           |
|------------|-------------------------------------------------------|
| `feat`     | New feature or functionality                          |
| `fix`      | Bug fix                                               |
| `chore`    | Maintenance tasks, dependencies, configs              |
| `docs`     | Documentation changes                                 |
| `style`    | Code style/formatting (no logic changes)              |
| `refactor` | Code restructuring without behavior change            |
| `perf`     | Performance improvements                              |
| `test`     | Adding or updating tests                              |
| `build`    | Build system or external dependencies                 |
| `ci`       | CI/CD configuration changes                           |

## Workflow

### Step 1: Check for Staged Changes

Run `git diff --staged --stat` to verify there are staged changes. If nothing is staged, inform the user and stop.

### Step 2: Analyze the Diff

Run `git diff --staged` to see the actual changes. Understand:
- What files are modified
- What code was added/removed/changed
- The purpose and context of changes

### Step 3: Determine Commit Type

Based on the analysis, determine the most appropriate type:
- If clearly one type (e.g., only test files changed → `test`), proceed
- If ambiguous (e.g., new feature with refactoring), use AskUserQuestion to let user choose

### Step 4: Generate Commit Message

**Title format**: `<type>: <description>`
- Use imperative mood ("add", "fix", "update", not "added", "fixes")
- Keep under 50 characters if possible, max 72
- Lowercase after type prefix
- No period at the end

**Body** (2-3 sentences):
- Focus on WHY the change was made, not WHAT changed
- Explain the motivation, problem being solved, or goal
- Mention any important trade-offs or decisions

### Step 5: Preview and Confirm

Display the full commit message in a code block. Use AskUserQuestion with options:
- "Yes, commit" - Proceed with commit
- "Edit title" - Let user modify the title
- "Edit body" - Let user modify the body
- "Cancel" - Abort without committing

### Step 6: Execute Commit

Only if user confirms, run the commit with the message using a HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
type: description

Body explaining WHY.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

## Example Output

```
## Staged Changes

- src/components/Button.tsx (+45, -12)
- src/hooks/useAuth.ts (+23, -0)

## Analysis

Added a new authentication hook and integrated it with the Button component to handle login state. The hook centralizes auth logic that was previously duplicated.

## Suggested Commit

feat: add useAuth hook for centralized authentication

Centralize authentication logic into a reusable hook to eliminate
duplication across components. The Button component now uses this
hook to conditionally render based on login state.

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Important Rules

1. **NEVER commit without user confirmation** - Always ask first
2. **Focus on WHY** - The diff shows WHAT; the message explains WHY
3. **Ask when uncertain** - If type is ambiguous, ask the user
4. **Keep it concise** - 2-3 sentences in body, not essays
5. **Use Co-Authored-By trailer** - No promotional lines
