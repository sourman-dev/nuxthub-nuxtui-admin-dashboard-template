# Code Standards & Conventions

## File Naming

### Components (`app/components/`)
- **Format**: PascalCase
- **Pattern**: `{Feature}{Type}.vue`
- **Examples**:
  - `DashboardUserMenu.vue`
  - `DashboardTeamsMenu.vue`
  - `NotificationsSlideover.vue`
- **Rationale**: Vue SFC convention, matches component name in templates

### Pages (`app/pages/`)
- **Format**: kebab-case
- **Pattern**: Descriptive, self-documenting names
- **Examples**:
  - `index.vue` (route: `/`)
  - `login.vue` (route: `/login`)
  - `optimistic-todos.vue` (route: `/optimistic-todos`)
  - `settings/index.vue` (route: `/settings`)
- **Rationale**: URL-friendly, matches route paths

### Composables (`app/composables/`)
- **Format**: camelCase
- **Pattern**: `use{Feature}.ts`
- **Mock Pattern**: `useMock{Feature}.ts` (located in `app/composables/mocks/`)
- **Examples**:
  - `useDashboard.ts`
  - `useMockCustomers.ts`
- **Rationale**: JavaScript convention, `use` prefix indicates composable, `Mock` prefix for prototype data

### Data Files (`app/data/`)
- **Format**: kebab-case
- **Extension**: `.json`
- **Pattern**: `{feature}.json`
- **Examples**:
  - `customers.json`
  - `sales.json`
- **Rationale**: Standard JSON storage for mock datasets

### API Routes (`server/api/`)
- **Format**: lowercase + HTTP method
- **Pattern**: `{resource}.{method}.ts` or `[id].{method}.ts`
- **Examples**:
  - `login.post.ts`
  - `logout.post.ts`
  - `index.get.ts`
  - `[id].patch.ts`
- **Rationale**: Maps to HTTP verbs, clear intent

### Types (`*.d.ts`)
- **Format**: kebab-case with `.d.ts` extension
- **Examples**:
  - `auth.d.ts`
  - `db.d.ts`
  - `index.d.ts`
- **Rationale**: TypeScript declaration convention

### General Files
- **Format**: kebab-case for multi-word, descriptive names
- **Examples**:
  - `nuxt.config.ts`
  - `eslint.config.mjs`
- **Preference**: Long, self-documenting names over abbreviations

## Code Organization

### Vue Components

**Standard Structure**:
```vue
<script setup lang="ts">
// Imports
import { ref } from 'vue'

// Props & Emits
interface Props {
  title: string
  count?: number
}
const props = defineProps<Props>()
const emit = defineEmits<{
  update: [value: number]
}>()

// Composables
const { user } = useUserSession()

// State
const localCount = ref(props.count ?? 0)

// Computed
const displayTitle = computed(() => props.title.toUpperCase())

// Methods
function handleClick() {
  localCount.value++
  emit('update', localCount.value)
}
</script>

<template>
  <UCard>
    <h2>{{ displayTitle }}</h2>
    <UButton @click="handleClick">
      Count: {{ localCount }}
    </UButton>
  </UCard>
</template>
```

**Guidelines**:
- Use `<script setup>` with TypeScript
- Define props/emits with type generics (no runtime validators unless needed)
- Group imports logically
- Destructure composables at top
- Use `computed` for derived state
- Prefer composition API over options API

### API Routes

**Standard Structure**:
```typescript
export default defineEventHandler(async (event) => {
  // 1. Authentication check
  const { user } = await requireUserSession(event)

  // 2. Input validation
  const body = await readBody(event)
  const validated = todoSchema.parse(body)

  // 3. Database operation
  const result = await useDrizzle()
    .insert(todos)
    .values({ ...validated, userId: user.id })
    .returning()

  // 4. Return response
  return result[0]
})
```

**Guidelines**:
- Use `defineEventHandler` wrapper
- Authenticate first with `requireUserSession` for protected routes
- Validate input with Zod before processing
- Use `useDrizzle()` for database access (auto-imported)
- Return data directly (Nuxt handles JSON serialization)
- Throw `createError()` for HTTP errors

### Composables

**Standard Structure**:
```typescript
import { createSharedComposable } from '@vueuse/core'

export const useDashboard = createSharedComposable(() => {
  // State
  const isNotificationsSlideoverOpen = ref(false)

  // Methods
  function openNotifications() {
    isNotificationsSlideoverOpen.value = true
  }

  // Keyboard shortcuts
  defineShortcuts({
    'n': openNotifications,
    'g-h': () => navigateTo('/')
  })

  // Return public API
  return {
    isNotificationsSlideoverOpen,
    openNotifications
  }
})
```

**Guidelines**:
- Use `createSharedComposable` for singleton state
- Export single default function
- Return object with public API
- Use `defineShortcuts` for keyboard shortcuts
- Co-locate types with composable

### Database Schema

**Standard Structure**:
```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  hashedPassword: text('hashed_password').notNull(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})
```

**Guidelines**:
- Use `sqliteTable` for table definitions
- Snake_case for column names (SQL convention)
- PascalCase for table variable names
- Always specify `.notNull()` unless truly optional
- Use `{ mode: 'timestamp' }` for dates
- Use `{ mode: 'boolean' }` for booleans (stored as 0/1)
- Define foreign keys with `.references()`

## TypeScript Usage

### Type Definitions

**Shared Types** (`shared/types/`):
```typescript
// auth.d.ts
declare module '#auth-utils' {
  interface UserSession {
    id: number
    email: string
    name?: string
  }
}

// db.d.ts
import { todos } from '~/server/db/schema'

export type Todo = typeof todos.$inferSelect
export type NewTodo = typeof todos.$inferInsert
```

**Component Types** (inline):
```typescript
interface Props {
  title: string
  count?: number
}

interface Emits {
  update: [value: number]
  delete: []
}
```

**Guidelines**:
- Use `interface` for object shapes
- Use `type` for unions, intersections, utilities
- Infer types from Drizzle schema with `$inferSelect`/`$inferInsert`
- Augment modules in `shared/types/*.d.ts`
- Avoid `any` - use `unknown` or specific types

### Strict Mode

tsconfig.json enforces:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

## Error Handling

### Frontend Errors (`app/utils/errors.ts`)

```typescript
export function handleApiError(error: unknown) {
  if (error instanceof Error) {
    toast.error(error.message)
  } else {
    toast.error('An unexpected error occurred')
  }
}
```

**Guidelines**:
- Use try/catch for async operations
- Display user-friendly messages
- Log detailed errors to console in dev
- Use type guards for error types

### Backend Errors

```typescript
// Bad request
throw createError({
  statusCode: 400,
  message: 'Invalid todo ID'
})

// Unauthorized
throw createError({
  statusCode: 401,
  message: 'Not authenticated'
})

// Not found
throw createError({
  statusCode: 404,
  message: 'Todo not found'
})
```

**Guidelines**:
- Use `createError` from `h3`
- Provide clear, actionable messages
- Return appropriate HTTP status codes
- Never expose sensitive information in errors

## Authentication Patterns

### Protected Routes (Frontend)

```typescript
// app/middleware/require-auth.ts
export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
```

**Usage**:
```vue
<script setup>
definePageMeta({
  middleware: 'require-auth'
})
</script>
```

### Protected API Routes (Backend)

```typescript
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  // user is guaranteed to exist here
})
```

## Validation Patterns

### Zod Schemas

```typescript
import { z } from 'zod'

const todoSchema = z.object({
  title: z.string().min(1).max(255),
  completed: z.boolean().default(false)
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const validated = todoSchema.parse(body) // Throws on invalid
  // ...
})
```

**Guidelines**:
- Define schemas at module level
- Use `.parse()` for throwing validation
- Use `.safeParse()` for non-throwing validation
- Provide clear error messages with `.refine()`

## Styling Conventions

### Nuxt UI Usage

```vue
<template>
  <!-- Use Nuxt UI components -->
  <UCard>
    <UButton color="primary" variant="solid">
      Click me
    </UButton>
  </UCard>

  <!-- Customize with classes -->
  <UButton class="w-full">
    Full width
  </UButton>
</template>
```

**Guidelines**:
- Prefer Nuxt UI components over custom HTML
- Use component props for styling (color, variant, size)
- Use Tailwind classes for spacing and layout
- Define theme in `app.config.ts` for consistency

### Tailwind Classes

**Order**: Layout → Spacing → Typography → Colors → Effects
```vue
<div class="flex items-center gap-4 text-lg font-bold text-gray-900">
```

## Testing Approach

### Current State
- No formal test suite configured
- Manual testing via dev server
- Type checking with `vue-tsc`

### Recommended (Future)
- **Unit**: Vitest for composables and utilities
- **E2E**: Playwright for critical user flows
- **Types**: `vue-tsc --noEmit` in CI

## ESLint Configuration

```javascript
// eslint.config.mjs
export default {
  extends: ['./.nuxt/eslint.config.mjs'],
  rules: {
    'quotes': ['error', 'single'],
    'comma-dangle': ['error', 'never']
  }
}
```

**Standards**:
- Single quotes for strings
- No trailing commas
- 2-space indentation
- No semicolons (except required)

## Git Workflow

### Branch Strategy
- `main`: Production-ready code
- Feature branches: `feature/{name}`
- Fix branches: `fix/{issue}`

### Commit Messages
- Present tense: "Add feature" not "Added feature"
- Imperative mood: "Fix bug" not "Fixes bug"
- Concise first line (<72 chars)

## YAGNI, KISS, DRY Principles

### YAGNI (You Aren't Gonna Need It)
- Don't add features speculatively
- Build only what's required now
- Example: No RBAC until multi-user needed

### KISS (Keep It Simple, Stupid)
- Prefer simple solutions over clever ones
- Use standard patterns over custom abstractions
- Example: Direct Drizzle queries over repository pattern

### DRY (Don't Repeat Yourself)
- Extract repeated logic to composables
- Share types between frontend/backend
- Example: `shared/types/` for common interfaces

## Unresolved Questions

None.
