---
name: slide
description: Create slides for the ai-workshop presentation. Supports existing slide types and custom components.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Slide Creator Skill

Create slides for the ai-workshop presentation using existing slide types or by building new custom components.

## Invocation

```
/slide [description]
```

**Examples:**

- `/slide add a content slide about prompt engineering basics`
- `/slide new section "04 Tools"`
- `/slide create custom slide for code comparison`

## Content Guidelines

When creating slide content from user input:

1. **Translate to English** — Unless it's a quote or small portion that must remain in native language
2. **Optimize text** — Treat user input as a base, not direct instruction; refine for clarity and readability
3. **Human-like formulation** — Polish rough notes into well-structured, natural-sounding content
4. **Bullet point limit** — Keep lists to **10 lines maximum** for readability
5. **Concise titles** — Slide titles should be short and descriptive

---

## Existing Slide Types

| Type                 | Component               | Props                                                         |
| -------------------- | ----------------------- | ------------------------------------------------------------- |
| `cover`              | CoverSlide              | `title`, `subtitle?`                                          |
| `section`            | SectionSlide            | `number`, `title`                                             |
| `content`            | ContentSlide            | `title`, `children` (content array), `sectionNumber?`, `sectionTitle?` |
| `image`              | ImageSlide              | `title`, `imageSrc`, `imageAlt?`, `sectionNumber?`, `sectionTitle?` |
| `tokenizer`          | TokenizerSlide          | `title`, `sectionNumber?`, `sectionTitle?`                    |
| `llm-demo`           | LLMDemoSlide            | `title`, `sectionNumber?`, `sectionTitle?`                    |
| `context-graph`      | ContextGraphSlide       | `title`, `sectionNumber?`, `sectionTitle?`                    |
| `lost-middle`        | LostMiddleSlide         | `title`, `sectionNumber?`, `sectionTitle?`                    |
| `subscription-value` | SubscriptionValueSlide  | `title`, `sectionNumber?`, `sectionTitle?`                    |
| `agent-list`         | AgentListSlide          | `title`, `sectionNumber?`, `sectionTitle?`                    |

### Content Slide Format

The `content` prop supports inline markdown and nested lists:

```typescript
// Simple list
content: [
  'First point',
  'Second point with **bold** and *italic*',
  'Point with `code` inline',
]

// Nested list (first item is header)
content: [
  ['**Header item**', 'Sub-item 1', 'Sub-item 2'],
  'Regular item',
]

// Inline markdown supported:
// **bold** → <strong>
// *italic* → <em> with font-display
// `code` → <code> with accent color
// [text](url) → <a> link
```

---

## Design System

### Colors

| Token        | Hex       | Usage                    |
| ------------ | --------- | ------------------------ |
| `charcoal`   | `#1a1a1a` | Background               |
| `main`       | `#faf8f5` | Primary text (cream)     |
| `muted`      | `#b8b8b8` | Secondary text           |
| `accent`     | `#d97757` | Highlights (coral)       |
| `warm-gray`  | `#3d3d3d` | Tertiary backgrounds     |
| `teal`       | `#4a9b8c` | Data visualization       |
| `teal-light` | `#7bc4b5` | Data viz secondary       |
| `purple`     | `#9b7ab8` | Data viz tertiary        |
| `blue`       | `#5b8ec9` | Data viz quaternary      |
| `yellow`     | `#c9a35b` | Data viz quinary         |
| `pink`       | `#c97b8e` | Data viz senary          |

### Fonts

| Token          | Font             | Usage          |
| -------------- | ---------------- | -------------- |
| `font-sans`    | Inter            | Body text      |
| `font-mono`    | JetBrains Mono   | Code, numbers  |
| `font-display` | Playfair Display | Emphasis, headings |

### Animation Pattern

All slides use Framer Motion with consistent timing:

```typescript
// Container fade
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.35 }}

// Element entrance with stagger
initial={{ y: 20, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ delay: STAGGER_DELAY, duration: 0.35 }}

// Stagger delays: 0, 0.07, 0.17, 0.27, 0.37...
// Pattern: delay = index === 0 ? 0 : 0.07 + (index - 1) * 0.1
```

---

## Workflow: Adding Slides with Existing Types

### Step 1: Determine slide position

Find where to insert in the `slides` array in `src/App.tsx:72-499`.

### Step 2: Add slide data

```typescript
// Content slide example
{
  id: NEXT_ID,
  type: 'content',
  title: 'Slide Title',
  content: [
    'First bullet point',
    ['**Grouped header**', 'Sub-point 1', 'Sub-point 2'],
    'Another point with `code` and *emphasis*',
  ],
  sectionNumber: '01',
  sectionTitle: 'Foundations',
},

// Section slide example
{
  id: NEXT_ID,
  type: 'section',
  number: '04',
  title: 'New Section',
},

// Image slide example
{
  id: NEXT_ID,
  type: 'image',
  title: 'Image Title',
  imageSrc: '/images/example.jpg',
  imageAlt: 'Description of image',
  sectionNumber: '01',
  sectionTitle: 'Foundations',
},
```

### Step 3: Update subsequent IDs

Increment `id` for all slides that follow the insertion point.

---

## Workflow: Creating Custom Slide Components

Use this when existing types don't fit the content needs.

### Step 1: Create component file

Create `src/components/slides/[Name]Slide.tsx`:

```tsx
import { motion } from 'framer-motion';

interface [Name]SlideProps {
  title: string;
  sectionNumber?: string;
  sectionTitle?: string;
  // Add custom props as needed
}

export function [Name]Slide({ title, sectionNumber, sectionTitle }: [Name]SlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="flex h-full w-full flex-col bg-charcoal px-24 py-16"
    >
      {/* Section badge (optional) */}
      {sectionNumber && sectionTitle && (
        <motion.div
          className="mb-2 flex items-center gap-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0, duration: 0.35 }}
        >
          <span className="flex size-6 items-center justify-center bg-accent font-mono text-xs font-medium text-charcoal">
            {sectionNumber}
          </span>
          <span className="font-sans text-lg text-muted">{sectionTitle}</span>
        </motion.div>
      )}

      {/* Title */}
      <motion.h2
        className="font-sans text-5xl font-semibold text-main"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.07, duration: 0.35 }}
      >
        {title}
      </motion.h2>

      {/* Custom content area */}
      <motion.div
        className="mt-12 flex-1"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.17, duration: 0.35 }}
      >
        {/* Your custom content here */}
      </motion.div>
    </motion.div>
  );
}
```

### Step 2: Add type to SlideData union

In `src/App.tsx:21-70`, add new type variant:

```typescript
type SlideData =
  | { id: number; type: 'cover'; title: string; subtitle?: string }
  // ... existing types ...
  | {
      id: number;
      type: 'your-type';
      title: string;
      sectionNumber?: string;
      sectionTitle?: string;
      // Add custom props
    };
```

### Step 3: Import component

Add import at top of `src/App.tsx`:

```typescript
import { [Name]Slide } from './components/slides/[Name]Slide';
```

### Step 4: Add case to renderSlide

In `src/App.tsx:501-584`, add switch case:

```typescript
case 'your-type':
  return (
    <[Name]Slide
      key={slide.id}
      title={slide.title}
      sectionNumber={slide.sectionNumber}
      sectionTitle={slide.sectionTitle}
      // Pass custom props
    />
  );
```

### Step 5: Add slide to array

Add entry to `slides` array at desired position.

---

## Critical Files Reference

| Purpose           | File                          | Lines     |
| ----------------- | ----------------------------- | --------- |
| SlideData type    | `src/App.tsx`                 | 21-70     |
| slides array      | `src/App.tsx`                 | 72-499    |
| renderSlide()     | `src/App.tsx`                 | 501-584   |
| Slide components  | `src/components/slides/`      | —         |
| Design tokens     | `src/index.css`               | 1-30      |

---

## Verification

After making changes:

1. Run `bun dev` to preview
2. Run `bun check` to verify no TypeScript/lint errors
3. Navigate to the new slide to confirm rendering
