# Researcher Report: Target Project Analysis & Conflicts (Researcher-02)

## Summary
Analysis of the current `nuxthub-nuxtui-admin-dashboard-template` project reveals a structured Nuxt application with integrated authentication and basic todo functionality. The primary goal is to preserve the authentication layer while preparing for the UI migration.

## 1. Authentication Files (MUST PRESERVE)
These files constitute the core auth logic and session management.

- `app/pages/login.vue`: Handles credentials, calls `/api/auth/login`, and reloads app.
- `app/middleware/require-auth.ts`: Route middleware checking `loggedIn` from `useUserSession`.
- `app/components/DashboardUserMenu.vue`: Handles logout via `/api/auth/logout`.
- `server/api/auth/login.post.ts` (Backend - confirmed via grep)
- `server/api/auth/logout.post.ts` (Backend - confirmed via grep)

## 2. Existing Structure
- **Components**: `DashboardTeamsMenu.vue`, `DashboardUserMenu.vue`, `NotificationsSlideover.vue`.
- **Pages**: `index.vue`, `login.vue`, `todos.vue`, `optimistic-todos.vue`, `customers.vue`, `inbox.vue`, `data-fetch-example.vue`, `settings/index.vue`.
- **Layouts**: `dashboard.vue`.
- **Composables**: `useDashboard.ts` (handles shortcuts and notifications state).
- **Other**: `app/queries/todos.ts`, `app/utils/errors.ts`, `app/types/index.d.ts`.

## 3. Potential Conflicts
The following files/names are likely to collide with the incoming dashboard UI:

- `app/app.vue`: Main entry point (will need merging).
- `app/app.config.ts`: UI configuration (colors, container size).
- `app/layouts/dashboard.vue`: Likely redundant with incoming dashboard layouts.
- `app/pages/index.vue`: Main dashboard page.
- `app/pages/settings/`: Existing settings page vs new settings structure.
- `app/composables/useDashboard.ts`: Shared state that might conflict with new UI logic.

## 4. Current API Usage
### Auth APIs (Preserve)
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Feature APIs (Candidates for Removal/Replacement)
- `GET /api/todos`
- `POST /api/todos`
- `PATCH /api/todos/:id`
- `DELETE /api/todos/:id`
- `GET /api/notifications`

## 5. Recommendations
- **Auth**: Keep `login.vue` and `require-auth.ts` exactly as they are. Ensure `useUserSession` from `nuxt-auth-utils` remains the source of truth.
- **Layout**: The incoming UI likely provides its own dashboard layout. Rename or replace `app/layouts/dashboard.vue`.
- **Navigation**: Update `useDashboard.ts` shortcuts and menu items to match new UI routes.
- **Config**: Merge `app.config.ts` UI settings carefully, favoring the new UI's look while keeping primary color preferences if desired.

## Unresolved Questions
- Should the `todos` functionality be completely removed or moved to a sub-page (e.g., `/features/todos`)?
- Does the incoming UI have its own `require-auth` middleware that might conflict?
- Will the `useUserSession` composable be compatible with the new UI's user profile components?
