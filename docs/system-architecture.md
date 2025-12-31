# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Vue 3 Application (SSR + CSR)                        │  │
│  │  - Nuxt UI Components                                 │  │
│  │  - Pinia State Management                             │  │
│  │  - Pinia Colada (Server State)                        │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/HTTPS
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              Nitro Server (Edge Runtime)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Routes (File-based)                               │ │
│  │  - Authentication (/api/auth/*)                        │ │
│  │  - Todos CRUD (/api/todos/*)                           │ │
│  │  - Notifications (/api/notifications)                  │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Middleware & Utils                                    │ │
│  │  - Session Management (nuxt-auth-utils)                │ │
│  │  - Database Client (Drizzle ORM)                       │ │
│  │  - Request Validation (Zod)                            │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQL Queries
                       │
┌──────────────────────▼──────────────────────────────────────┐
│            Database (SQLite/LibSQL)                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Tables                                                │ │
│  │  - users (id, email, hashedPassword, name, createdAt) │ │
│  │  - todos (id, userId, title, completed, createdAt)    │ │
│  └────────────────────────────────────────────────────────┘ │
│                    (NuxtHub Managed)                        │
└─────────────────────────────────────────────────────────────┘

                  Deployment Platform
┌─────────────────────────────────────────────────────────────┐
│               Cloudflare Workers + Pages                    │
│  - Edge distribution (global CDN)                           │
│  - Zero cold starts                                         │
│  - Automatic HTTPS                                          │
│  - D1 Database (production)                                 │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Layers

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Pages (app/pages/)                            │
│  - File-based routing                                   │
│  - Page-level logic                                     │
│  - Route middleware                                     │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  Layer 2: Layouts (app/layouts/)                        │
│  - dashboard.vue: Sidebar, header, navigation           │
│  - Shared UI structure                                  │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  Layer 3: Components (app/components/)                  │
│  - DashboardUserMenu: User profile dropdown             │
│  - DashboardTeamsMenu: Team switcher                    │
│  - NotificationsSlideover: Notification panel           │
│  - Nuxt UI primitives (UButton, UCard, etc.)            │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  Layer 4: Composables (app/composables/)                │
│  - useDashboard: Shared dashboard state                 │
│  - useUserSession: Auth state (nuxt-auth-utils)         │
│  - Auto-imported into components                        │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  Layer 5: State Management                              │
│  - Pinia: Global client state                           │
│  - Pinia Colada: Server state, caching, optimistic UI   │
└─────────────────────────────────────────────────────────┘
```

### Rendering Strategy

- **SSR (Server-Side Rendering)**: Initial page load
- **CSR (Client-Side Rendering)**: Navigation after hydration
- **Universal Rendering**: Same code runs on server + client

## Backend Architecture

### API Route Structure

```
server/api/
├── auth/
│   ├── login.post.ts      → POST /api/auth/login
│   └── logout.post.ts     → POST /api/auth/logout
├── todos/
│   ├── index.get.ts       → GET /api/todos
│   ├── index.post.ts      → POST /api/todos
│   ├── [id].patch.ts      → PATCH /api/todos/:id
│   ├── [id].delete.ts     → DELETE /api/todos/:id
│   └── stats.ts           → GET /api/todos/stats
└── notifications.ts       → GET /api/notifications
```

### Request Flow

```
1. HTTP Request
   ↓
2. Nitro Router (file-based)
   ↓
3. Event Handler (defineEventHandler)
   ↓
4. Authentication Check (requireUserSession)
   ↓
5. Input Validation (Zod)
   ↓
6. Database Query (Drizzle ORM)
   ↓
7. Response (JSON)
```

### Database Layer

```typescript
// Drizzle ORM abstraction
useDrizzle()
  .select()
  .from(users)
  .where(eq(users.id, userId))

// Auto-generates parameterized SQL
// SELECT * FROM users WHERE id = ?

// Prevents SQL injection
// Type-safe at compile time
```

## Database Schema & Relationships

```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  hashed_password TEXT NOT NULL,
  name TEXT,
  created_at INTEGER NOT NULL
);

-- Todos table
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  completed INTEGER DEFAULT 0, -- SQLite boolean (0/1)
  created_at INTEGER NOT NULL
);

-- Indexes
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE UNIQUE INDEX idx_users_email ON users(email);
```

### Entity Relationships

```
┌──────────────┐         ┌──────────────┐
│    users     │         │    todos     │
├──────────────┤         ├──────────────┤
│ id (PK)      │◄────────│ user_id (FK) │
│ email        │    1:N  │ title        │
│ hashed_pwd   │         │ completed    │
│ name         │         │ created_at   │
│ created_at   │         └──────────────┘
└──────────────┘

One user has many todos
Todo belongs to one user
```

## Authentication Flow

### Login Sequence

```
1. User submits email + password
   ↓
2. POST /api/auth/login
   ↓
3. Query user by email
   ↓
4. Verify password (bcrypt/scrypt)
   ↓
5. setUserSession(event, { id, email, name })
   ↓
6. Set encrypted cookie (nuxt-auth-utils)
   ↓
7. Return user data
   ↓
8. Frontend updates auth state
```

### Protected Route Flow

```
Frontend:
1. Navigate to /todos
   ↓
2. require-auth middleware runs
   ↓
3. Check useUserSession().loggedIn
   ↓
4. If false → navigateTo('/login')
   ↓
5. If true → render page

Backend:
1. GET /api/todos
   ↓
2. requireUserSession(event)
   ↓
3. If no session → throw 401
   ↓
4. If valid → return { user }
   ↓
5. Query todos for user.id
```

### Session Management

```
┌─────────────────────────────────────────┐
│  nuxt-auth-utils                        │
│  - Encrypted cookie storage             │
│  - Auto-refresh sessions                │
│  - Cross-request persistence            │
│  - Configurable expiry (default: 30d)   │
└─────────────────────────────────────────┘

Cookie: nuxt-session={encrypted-payload}
Payload: { user: { id, email, name }, exp }
Encryption: AES-256-GCM (NUXT_SESSION_PASSWORD)
```

## Deployment Architecture

### Development Environment

```
Local Machine
├── SQLite Database (.data/db.sqlite3)
├── Nuxt Dev Server (localhost:3000)
│   ├── HMR (Hot Module Replacement)
│   ├── Drizzle Studio (DevTools)
│   └── Auto-migrations
└── File Watcher (nuxi dev)
```

### Production Environment (NuxtHub/Cloudflare)

```
Cloudflare Global Network
├── Cloudflare Pages
│   ├── Static Assets (/_nuxt/*)
│   ├── HTML Pages (SSR)
│   └── CDN Caching
├── Cloudflare Workers
│   ├── Nitro Server (Edge Runtime)
│   ├── API Routes
│   └── Middleware
└── NuxtHub Database
    ├── Turso/LibSQL (D1)
    ├── Automatic Backups
    └── Multi-region Replication
```

### Deployment Pipeline

```
1. Code Push (git push)
   ↓
2. NuxtHub CLI (npx nuxthub deploy)
   ↓
3. Build Nitro Server + Static Assets
   ↓
4. Run Database Migrations
   ↓
5. Deploy to Cloudflare Workers
   ↓
6. Deploy to Cloudflare Pages
   ↓
7. Invalidate CDN Cache
   ↓
8. Live (Edge Deployment)
```

## Data Flow Patterns

### Standard CRUD Flow

```
User Action (Click "Add Todo")
   ↓
Component Event Handler
   ↓
API Call (POST /api/todos)
   ↓
Nitro Server Handler
   ↓
Validate Input (Zod)
   ↓
Insert to Database (Drizzle)
   ↓
Return New Todo
   ↓
Update Local State (Pinia Colada)
   ↓
UI Re-renders
```

### Optimistic UI Flow

```
User Action (Toggle Complete)
   ↓
Update Local State Immediately
   ↓
UI Re-renders (instant feedback)
   ↓
API Call (PATCH /api/todos/:id)
   ↓
Server Updates Database
   ↓
On Success: Confirm local state
   ↓
On Error: Revert local state + show error
```

## State Management Architecture

### Pinia (Global Client State)

```typescript
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  const preferences = ref({ theme: 'dark' })

  function updateTheme(theme: string) {
    preferences.value.theme = theme
  }

  return { preferences, updateTheme }
})
```

### Pinia Colada (Server State)

```typescript
// Automatic caching, refetching, invalidation
const { data, isLoading, refetch } = useQuery({
  key: ['todos'],
  query: () => $fetch('/api/todos')
})

// Optimistic mutations
const { mutate } = useMutation({
  mutation: (todo) => $fetch('/api/todos', {
    method: 'POST',
    body: todo
  }),
  onSuccess: () => {
    refetch() // Invalidate cache
  }
})
```

## Performance Considerations

### Frontend Optimizations
- SSR for fast initial load
- Code splitting by route
- Lazy-loaded components
- Optimistic UI for perceived speed
- Pinia Colada caching reduces API calls

### Backend Optimizations
- Edge deployment (low latency)
- Parameterized queries (SQL injection prevention + performance)
- Database indexes on foreign keys
- Connection pooling (Drizzle)

### Database Optimizations
- Indexes on `todos.user_id`, `users.email`
- Integer primary keys (faster than UUIDs)
- Timestamps as integers (smaller than strings)

## Security Architecture

### Defense Layers

```
1. Input Validation (Zod)
   - Prevent malformed data

2. Parameterized Queries (Drizzle)
   - Prevent SQL injection

3. Session Encryption (nuxt-auth-utils)
   - Prevent session tampering

4. Password Hashing (bcrypt/scrypt)
   - Protect credentials

5. HTTPS (Cloudflare)
   - Encrypt in transit

6. CSRF Protection (nuxt-auth-utils)
   - Prevent cross-site requests
```

## Monitoring & Observability

### Current State
- Development: Nuxt DevTools
- Production: Cloudflare Analytics (basic)

### Recommended (Future)
- Error tracking: Sentry
- Performance monitoring: Cloudflare Web Analytics
- Database metrics: NuxtHub Dashboard
- Logs: Cloudflare Workers Logs

## Unresolved Questions

None.
