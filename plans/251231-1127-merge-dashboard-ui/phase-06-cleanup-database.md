# Phase 06: Cleanup Database

## Context Links
- **Parent Plan**: [Merge Dashboard UI Plan](./plan.md)
- **Previous Phase**: [Phase 05: Merge Layouts](./phase-05-merge-layouts.md)
- **Next Phase**: [Phase 07: Integration Testing](./phase-07-integration-testing.md)
- **Can Run Parallel**: With Phase 03-05 (no dependencies)

---

## Overview

**Date**: 2025-12-31
**Description**: Remove all todos-related code, database tables, and API endpoints
**Priority**: P1 (Critical)
**Status**: Pending
**Effort**: 30 minutes

---

## Key Insights

- Todos feature is demo code, not production feature
- Database should only contain users table (auth)
- All todos API endpoints must be removed
- Migration needed to drop todos table
- Seed task needs update (remove todos seeding)
- Query files for todos can be deleted

---

## Requirements

### Must Have
- ✅ Todos table removed from schema.ts
- ✅ Migration generated to drop todos table
- ✅ All `/api/todos/*` endpoints deleted (5 files)
- ✅ `todos.vue` and `optimistic-todos.vue` deleted
- ✅ `app/queries/todos.ts` deleted
- ✅ Seed task updated (remove todos seeding)

### Should Have
- ✅ Database re-seeded with clean users table only
- ✅ No todos references in codebase (grep verification)
- ✅ Git commit for clean history

### Nice to Have
- ⚪ Backup of todos code (for reference)
- ⚪ Documentation of removed features

---

## Architecture

### Current Database Schema
```typescript
// server/db/schema.ts
export const users = sqliteTable('users', { ... })
export const todos = sqliteTable('todos', { ... })  // REMOVE THIS
```

### Target Database Schema
```typescript
// server/db/schema.ts (after cleanup)
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  hashedPassword: text('hashed_password').notNull(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})

// No todos table
```

### Files to Delete

**API Endpoints** (5 files):
- `server/api/todos/index.get.ts` (fetch todos)
- `server/api/todos/index.post.ts` (create todo)
- `server/api/todos/[id].patch.ts` (update todo)
- `server/api/todos/[id].delete.ts` (delete todo)
- `server/api/todos/stats.ts` (todo statistics)

**Pages** (2 files):
- `app/pages/todos.vue`
- `app/pages/optimistic-todos.vue`

**Queries** (1 file):
- `app/queries/todos.ts`

**Other**:
- `app/pages/data-fetch-example.vue` (if todos-specific)

---

## Related Code Files

### Files to Modify
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/server/db/schema.ts`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/server/tasks/seed.ts`

### Files to Delete
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/server/api/todos/*.ts` (all files)
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/pages/todos.vue`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/pages/optimistic-todos.vue`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/queries/todos.ts`

### Migration Files
- Generate new: `server/db/migrations/sqlite/0001_drop_todos.sql`

---

## Implementation Steps

### Step 1: Backup Todos Code (Optional, 3 minutes)

```bash
# Create backup of todos feature
mkdir -p .backup/todos
cp -r server/api/todos .backup/todos/
cp app/pages/todos.vue .backup/todos/
cp app/pages/optimistic-todos.vue .backup/todos/
cp app/queries/todos.ts .backup/todos/
```

**Validation**: Backup directory created

---

### Step 2: Delete Todos API Endpoints (2 minutes)

```bash
# Delete entire todos API directory
rm -rf server/api/todos

# Verify deletion
ls server/api/  # Should only show 'auth' directory
```

**Validation**: `server/api/todos/` directory deleted

---

### Step 3: Delete Todos Pages (2 minutes)

```bash
# Delete todos pages
rm app/pages/todos.vue
rm app/pages/optimistic-todos.vue

# Verify deletion
ls app/pages/  # Should not show todos files
```

**Validation**: Todos pages deleted

---

### Step 4: Delete Todos Queries (1 minute)

```bash
# Delete todos query file
rm app/queries/todos.ts

# Check if queries directory is empty
ls app/queries/
```

**Validation**: todos.ts deleted

---

### Step 5: Update Database Schema (5 minutes)

Edit `server/db/schema.ts`:

```typescript
// REMOVE entire todos table definition
// DELETE these lines:
export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})

// KEEP only:
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  hashedPassword: text('hashed_password').notNull(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
})
```

**Validation**: Only users table in schema.ts

---

### Step 6: Update Seed Task (5 minutes)

Edit `server/tasks/seed.ts`:

```typescript
// REMOVE todos seeding logic
// KEEP only user seeding

export default defineTask({
  meta: {
    name: 'db:seed',
    description: 'Seed database with default admin user'
  },
  async run() {
    console.log('Seeding database...')

    const db = useDrizzle()

    // Only seed admin user (NO todos)
    await db.insert(tables.users).values({
      email: 'admin@example.com',
      hashedPassword: await hashPassword('admin123'),
      name: 'Admin User',
      createdAt: new Date()
    }).onConflictDoNothing()

    console.log('✅ Database seeded')
    return { result: 'Success' }
  }
})
```

**Validation**: Seed task only creates users

---

### Step 7: Generate Migration (5 minutes)

```bash
# Generate new migration
pnpm db:generate

# This creates migration file to drop todos table
# Review generated migration in server/db/migrations/sqlite/
```

**Expected Migration**:
```sql
-- Drop todos table
DROP TABLE IF EXISTS todos;
```

**Validation**: Migration file created with DROP TABLE

---

### Step 8: Apply Migration (2 minutes)

```bash
# Stop dev server if running

# Apply migration (drops todos table)
# Migration runs automatically on next server start, or manually run:
# (NuxtHub applies migrations on startup)

# Start dev server to apply migration
pnpm dev
```

**Validation**: Server starts without errors, todos table dropped

---

### Step 9: Verify Database (3 minutes)

```bash
# Check database schema
# Access NuxtHub local database or use drizzle-kit

# Expected: Only users table exists

# Alternative: Query via API
curl http://localhost:3000/api/todos  # Should return 404
```

**Validation**: Todos endpoints return 404, database has only users table

---

### Step 10: Grep for Todos References (5 minutes)

```bash
# Search for any remaining todos references
grep -r "todos" app/ server/ --exclude-dir=node_modules

# Expected: No results (or only comments)

# Search for /api/todos
grep -r "/api/todos" app/ --exclude-dir=node_modules
```

**Validation**: No todos references in codebase

---

### Step 11: Re-seed Database (2 minutes)

```bash
# Stop dev server
# Clear existing database
rm -rf .data/

# Start dev server (creates new DB)
pnpm dev

# Run seed task
npx nitro task db:seed
```

**Validation**: Only admin user seeded, no todos

---

## Todo List

- [ ] Backup todos code to .backup/todos/ (optional)
- [ ] Delete server/api/todos/ directory (5 files)
- [ ] Delete app/pages/todos.vue
- [ ] Delete app/pages/optimistic-todos.vue
- [ ] Delete app/queries/todos.ts
- [ ] Remove todos table from server/db/schema.ts
- [ ] Update server/tasks/seed.ts (remove todos seeding)
- [ ] Generate new migration (pnpm db:generate)
- [ ] Review generated migration (DROP TABLE todos)
- [ ] Apply migration (start dev server)
- [ ] Verify todos table dropped (check database)
- [ ] Test /api/todos returns 404
- [ ] Grep for "todos" references (should be none)
- [ ] Grep for "/api/todos" references (should be none)
- [ ] Clear .data/ directory
- [ ] Re-seed database (npx nitro task db:seed)
- [ ] Verify only users table exists
- [ ] Run typecheck (pnpm typecheck)

---

## Success Criteria

### File Deletion
- ✅ server/api/todos/ directory deleted (5 files removed)
- ✅ app/pages/todos.vue deleted
- ✅ app/pages/optimistic-todos.vue deleted
- ✅ app/queries/todos.ts deleted

### Database Schema
- ✅ server/db/schema.ts contains only users table
- ✅ No todos table definition
- ✅ Migration generated to drop todos table
- ✅ Migration applied successfully

### Seed Task
- ✅ server/tasks/seed.ts only creates admin user
- ✅ No todos seeding logic
- ✅ Seed task runs without errors

### Verification
- ✅ `/api/todos` returns 404
- ✅ Database has only users table
- ✅ No "todos" references in codebase (grep)
- ✅ `pnpm typecheck` passes

### Clean State
- ✅ Fresh database seed successful
- ✅ Admin user exists
- ✅ No todos data

---

## Risk Assessment

### Medium Risk
**Risk**: Accidentally deleting auth-related code
**Impact**: High (breaks authentication)
**Probability**: Low (clear file paths)
**Mitigation**: Review file paths before deletion, use rm with explicit paths (no wildcards)

### Medium Risk
**Risk**: Migration fails to drop table
**Impact**: Moderate (old schema lingers)
**Probability**: Low (Drizzle handles migrations)
**Mitigation**: Manual DROP TABLE if migration fails, verify with database inspection

### Low Risk
**Risk**: Missed todos references in codebase
**Impact**: Low (dead code, no runtime errors)
**Probability**: Low (grep verification)
**Mitigation**: Comprehensive grep, typecheck to catch broken imports

---

## Security Considerations

- Dropping tables is irreversible (data loss)
- Verify no production data in todos table before dropping
- Backup before deletion if any valuable data exists
- Migration should run in development first before production

---

## Next Steps

After completion:
1. Verify all success criteria met
2. Confirm database clean (only users table)
3. Proceed to [Phase 07: Integration Testing](./phase-07-integration-testing.md)

---

## Unresolved Questions

1. Should we keep data-fetch-example.vue page?
   → **Recommendation**: Delete if todos-specific, keep if generic example

2. What if migration fails in production?
   → **Solution**: Manual SQL execution with rollback plan

3. Should we document removed features?
   → **Recommendation**: Add brief note in README or changelog
