# Codebase Summary

## Directory Structure

```
nuxthub-nuxtui-admin-dashboard-template/
├── app/                      # Frontend application
│   ├── assets/               # Global CSS, images
│   ├── components/           # Vue components
│   ├── composables/          # Shared composables
│   │   └── mocks/            # Mock data composables
│   ├── data/                 # Static mock data (JSON)
│   ├── layouts/              # Layout components
│   ├── middleware/           # Route middleware
│   ├── pages/                # File-based routes
│   ├── queries/              # Data query logic
│   ├── types/                # Frontend TypeScript types
│   ├── utils/                # Utility functions
│   ├── app.vue               # Root component
│   └── app.config.ts         # Nuxt UI configuration
├── server/                   # Backend (Nitro)
│   ├── api/                  # API endpoints
│   │   ├── auth/             # Authentication routes
│   │   └── todos/            # Todo CRUD endpoints
│   ├── database/             # Production migrations
│   ├── db/                   # Database schema & local migrations
│   │   ├── migrations/       # SQLite migration files
│   │   └── schema.ts         # Drizzle schema definitions
│   ├── tasks/                # Background tasks
│   │   └── seed.ts           # Database seeding
│   └── tsconfig.json         # Server TypeScript config
├── shared/                   # Shared types (app + server)
│   └── types/
│       ├── auth.d.ts         # UserSession interface
│       └── db.d.ts           # Database types
├── public/                   # Static assets
├── docs/                     # Project documentation
├── plans/                    # Planning & reports
├── .claude/                  # Claude Code configuration
├── nuxt.config.ts            # Nuxt configuration
├── package.json              # Dependencies & scripts
└── tsconfig.json             # Root TypeScript config
```

## Key Files & Purposes

### Configuration

| File | Purpose |
|------|---------|
| `nuxt.config.ts` | Nuxt 4 configuration: modules, hub DB, Nitro tasks, mock imports |
| `tsconfig.json` | TypeScript project references (app/server/shared) |
| `eslint.config.mjs` | ESLint configuration extending Nuxt defaults |
| `package.json` | Dependencies, scripts, pnpm configuration |
| `.env` | Environment variables (OAuth, session secrets) |

### Application Layer (`app/`)

| File/Directory | Purpose |
|----------------|---------|
| `app.vue` | Root component: SEO meta, global styles, layout wrapper |
| `app.config.ts` | Nuxt UI theme: primary color (amber), component defaults |
| `layouts/dashboard.vue` | Main layout: sidebar, search, navigation, keyboard shortcuts |
| `middleware/require-auth.ts` | Route protection: redirect unauthenticated users |
| `pages/index.vue` | Dashboard home page |
| `pages/login.vue` | Authentication page |
| `pages/todos.vue` | Standard todo list |
| `pages/optimistic-todos.vue` | Optimistic UI demo |
| `pages/customers.vue` | Customer management view |
| `pages/inbox.vue` | Messaging interface |
| `pages/settings/index.vue` | Settings page |
| `pages/mock-test.vue` | Mock data layer verification page |
| `components/DashboardTeamsMenu.vue` | Team switcher component |
| `components/DashboardUserMenu.vue` | User profile menu |
| `components/NotificationsSlideover.vue` | Notifications panel |
| `composables/useDashboard.ts` | Shared dashboard state & shortcuts |
| `composables/mocks/` | Mock data accessors (customers, mails, etc.) |
| `data/` | JSON files containing static mock data |
| `utils/errors.ts` | Error handling utilities |
| `types/index.d.ts` | Frontend types: User, Mail, Member, Sale, Notification |
| `types/mocks.d.ts` | Mock-specific type definitions |

### Server Layer (`server/`)

| File/Directory | Purpose |
|----------------|---------|
| `api/auth/login.post.ts` | POST endpoint: authenticate user, set session |
| `api/auth/logout.post.ts` | POST endpoint: clear user session |
| `api/todos/index.get.ts` | GET endpoint: fetch user's todos |
| `api/todos/index.post.ts` | POST endpoint: create todo (Zod validation) |
| `api/todos/[id].patch.ts` | PATCH endpoint: update todo |
| `api/todos/[id].delete.ts` | DELETE endpoint: remove todo |
| `api/todos/stats.ts` | GET endpoint: todo statistics |
| `api/notifications.ts` | GET endpoint: mock notifications |
| `db/schema.ts` | Drizzle schema: users table |
| `db/migrations/` | SQLite migration files & metadata |
| `tasks/seed.ts` | Nitro task: seed default admin user |

### Shared Layer (`shared/`)

| File | Purpose |
|------|---------|
| `types/auth.d.ts` | UserSession interface: id, name, email |
| `types/db.d.ts` | Database types inferred from Drizzle schema |

## Module Organization

### Frontend Modules
- **UI Framework**: `@nuxt/ui` (v4.2.1) - Component library
- **State Management**: `@pinia/nuxt` + `@pinia/colada-nuxt` - Global + server state
- **Icons**: `@iconify-json/lucide` + `@iconify-json/simple-icons`

### Backend Modules
- **Database**: `@nuxthub/core` (v0.10.0) - NuxtHub integration
- **ORM**: `drizzle-orm` (v0.44.7) + `drizzle-kit` (v0.31.7)
- **Database Client**: `@libsql/client` (v0.15.15) - LibSQL/Turso
- **Auth**: `nuxt-auth-utils` (v0.5.25) - Session management
- **Validation**: `zod` (v4.1.13) - Schema validation

### Development Tools
- **Linting**: `@nuxt/eslint` (v1.11.0) + `eslint` (v9.39.1)
- **Type Checking**: `typescript` (v5.9.3) + `vue-tsc` (v3.1.6)
- **DevTools**: `@nuxt/devtools` (v3.1.1)

## Dependencies Overview

### Core Runtime
```json
{
  "nuxt": "^4.2.1",
  "@nuxthub/core": "^0.10.0",
  "@nuxt/ui": "^4.2.1",
  "pinia": "^3.0.4"
}
```

### Database Stack
```json
{
  "drizzle-orm": "0.44.7",
  "drizzle-kit": "^0.31.7",
  "@libsql/client": "^0.15.15"
}
```

### Authentication & Validation
```json
{
  "nuxt-auth-utils": "^0.5.25",
  "zod": "^4.1.13"
}
```

## Entry Points

### Development
```bash
pnpm dev              # Start dev server (localhost:3000)
pnpm dev --remote     # Connect to remote NuxtHub database
```

### Production Build
```bash
pnpm build            # Build for production
pnpm preview          # Preview production build (NuxtHub)
```

### Database
```bash
pnpm db:generate      # Generate Drizzle migrations
npx nitro task db:seed  # Seed database with default user
```

### Code Quality
```bash
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm typecheck        # Type check with vue-tsc
```

## Build Outputs

- **`.nuxt/`**: Nuxt build cache & generated files
- **`.output/`**: Production build (Nitro server + static assets)
- **`node_modules/`**: Installed dependencies
- **`.data/`**: Local SQLite database files (dev)

## Auto-Imports

Nuxt auto-imports from:
- Vue (`ref`, `computed`, `watch`, etc.)
- Nuxt (`useState`, `navigateTo`, `useRoute`, etc.)
- `app/composables/` (custom composables)
- `app/utils/` (utility functions)
- Nuxt UI components (`UButton`, `UCard`, etc.)

## File Naming Conventions

- **Components**: PascalCase (`DashboardUserMenu.vue`)
- **Pages**: kebab-case (`optimistic-todos.vue`)
- **Composables**: camelCase with `use` prefix (`useDashboard.ts`)
- **API Routes**: lowercase with HTTP method (`login.post.ts`)
- **Types**: camelCase with `.d.ts` extension (`auth.d.ts`)

## Code Organization Patterns

### Composables
- Use `createSharedComposable` for singleton state
- Export single default function
- Co-locate types with composable

### API Routes
- One HTTP method per file (`*.get.ts`, `*.post.ts`)
- Use `defineEventHandler` wrapper
- Validate with Zod before processing
- Use `requireUserSession` for protected routes

### Components
- Use `<script setup lang="ts">` syntax
- Define props with `defineProps<T>()`
- Emit events with `defineEmits<T>()`
- Use Nuxt UI components for consistency

## Unresolved Questions

None.
