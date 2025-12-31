# Phase 03 Test Report: Merge Components

## Test Results Overview
- **Total Checks**: 6
- **Passed**: 4
- **Failed**: 2 (Typecheck errors in merged components and legacy todo API)
- **Skipped**: 0

## Phase 03 Files Verification
- **Component Imports**: 14 components correctly placed in `app/components/` and subdirectories. Auto-import functional via Nuxt.
- **Naming Conflicts**: No duplicates found. `DashboardUserMenu` and `DashboardTeamsMenu` are unique.
- **Client/Server Suffixes**: `HomeChart.client.vue` and `HomeChart.server.vue` correctly named.
- **Auth Preservation**: `DashboardUserMenu.vue` contains full logout logic and uses `useUserSession` (lines 8, 101-105).
- **Dependencies**: `@vueuse/nuxt` present in `package.json` and `nuxt.config.ts`.
- **Utils**: `app/utils/index.ts` exists and contains required helper functions.

## Failed Tests & Issues
- **TypeScript Errors**:
    - `app/components/DashboardUserMenu.vue`:
        - `User` type missing `name` and `email` properties (using `nuxt-auth-utils` defaults).
        - `DropdownMenuItem` avatar property mismatch.
    - `server/api/todos/*`:
        - `todos` table not found in `schema.ts`. This is a regression/conflict from previous phases where `todos` might have been removed or renamed.
    - `app/pages/optimistic-todos.vue`: `id` missing on `User`.

## Performance Metrics
- `pnpm typecheck` execution: ~15s.

## Build Status
- **Nuxt Prepare**: Successful.
- **Typecheck**: FAILED.

## Critical Issues
1. **Auth Type Mismatch**: `User` interface in `#auth-utils` needs to match usage in `DashboardUserMenu`.
2. **Schema Desync**: Server API routes for todos are broken because `todos` table is missing from `server/db/schema.ts`.

## Recommendations
1. Update `shared/types/auth.d.ts` to ensure `User` properties are correctly exposed to the frontend.
2. Restore or update `todos` table in `server/db/schema.ts` to support legacy todo features or migrate them to the new dashboard structure.
3. Fix `UDropdownMenu` item typing in `DashboardUserMenu.vue`.

## Next Steps
1. Resolve TypeScript errors in `DashboardUserMenu.vue`.
2. Align database schema with todo API requirements.
3. Re-run typecheck to confirm Phase 03 stability.

**Unresolved Questions:**
- Should the legacy todo functionality be maintained or replaced by the new dashboard components?
- Is there a central `User` type definition that should be used instead of the module augmentation in `shared/types/auth.d.ts`?
