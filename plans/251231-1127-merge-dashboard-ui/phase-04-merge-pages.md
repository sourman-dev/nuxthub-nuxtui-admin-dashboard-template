# Phase 04: Merge Pages

## Context Links
- **Parent Plan**: [Merge Dashboard UI Plan](./plan.md)
- **Previous Phase**: [Phase 03: Merge Components](./phase-03-merge-components.md)
- **Next Phase**: [Phase 05: Merge Layouts](./phase-05-merge-layouts.md)
- **Dependencies**: Phase 02 (Mock Data), Phase 03 (Components)

---

## Overview

**Date**: 2025-12-31
**Description**: Merge 8 dashboard pages from source, update to use mock data, add auth middleware
**Priority**: P1 (Critical)
**Status**: Pending
**Effort**: 30 minutes (Clean Slate) / 1.5 hours (Selective)

---

## Key Insights

- Source has 8 pages: index, customers, inbox, settings (+ 4 nested settings)
- All pages use `/api/*` calls - must replace with mock composables
- Target's login.vue MUST be preserved (auth flow)
- All dashboard pages need `middleware: 'require-auth'`
- Source index.vue is complete dashboard (replace target's simple version)

---

## Requirements

### Must Have
- ✅ All 8 source pages copied to target
- ✅ login.vue preserved from target (NOT overwritten)
- ✅ All API calls replaced with mock composables
- ✅ `middleware: 'require-auth'` added to all dashboard pages
- ✅ Route navigation working (no 404s)

### Should Have
- ✅ Page metadata (titles, descriptions) added
- ✅ Loading states for async data
- ✅ Error handling for failed data fetches

### Nice to Have
- ⚪ SEO metadata (og:tags)
- ⚪ Page transitions
- ⚪ Breadcrumb navigation

---

## Architecture

### Source Pages (8 files)

**Root Level**:
- `index.vue` → Dashboard home (charts, stats) - REPLACE target's simple version
- `customers.vue` → Customer management table
- `inbox.vue` → Mail inbox interface
- `settings.vue` → Settings layout wrapper

**Settings Nested** (`settings/`):
- `settings/index.vue` → General settings
- `settings/members.vue` → Team members management
- `settings/notifications.vue` → Notification preferences
- `settings/security.vue` → Security settings

### Target Pages (Preserve/Remove)

**Preserve**:
- `login.vue` → Login form (CRITICAL - auth flow)

**Remove** (todos-related, Phase 06):
- `todos.vue` → Delete
- `optimistic-todos.vue` → Delete

**Replace**:
- `index.vue` → Replace with source dashboard

**Keep** (already exist, may update):
- `customers.vue` → Replace with source
- `inbox.vue` → Replace with source
- `settings/index.vue` → Replace with source

### API → Mock Data Mapping

| Source API Call | Mock Composable | File |
|-----------------|-----------------|------|
| `/api/notifications` | `useMockNotifications()` | All pages with notifications |
| `/api/members` | `useMockMembers()` | settings/members.vue |
| `/api/mails` | `useMockMails()` | inbox.vue |
| `/api/customers` | `useMockCustomers()` | customers.vue |
| Sales data | `useMockSales()` | index.vue (charts) |

---

## Related Code Files

### Source Files
Located in: `/Users/uspro/Projects/nuxt-ui-dashboard/app/pages/`
- All 8 page files

### Target Location
Copy to: `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/pages/`

### Preserve
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/pages/login.vue`

### Delete (Phase 06)
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/pages/todos.vue`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/pages/optimistic-todos.vue`

---

## Implementation Steps (Clean Slate Approach)

### Step 1: Backup login.vue (2 minutes)

```bash
# Already backed up in Phase 01, but verify
ls -la .backup/auth/app/pages/login.vue

# If not backed up, backup now
cp app/pages/login.vue .backup/auth/app/pages/login.vue
```

**Validation**: login.vue exists in backup

---

### Step 2: Copy Dashboard Home (5 minutes)

```bash
# Replace target's simple index.vue with source dashboard
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/pages/index.vue \
   app/pages/index.vue
```

**Update**: Replace API calls with mock data in `app/pages/index.vue`

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'require-auth'
})

// OLD: const { data: sales } = await useFetch('/api/sales')
// NEW:
const { fetchSales } = useMockSales()
const sales = await fetchSales()
</script>
```

**Validation**: File copied, API calls replaced

---

### Step 3: Copy Customers Page (5 minutes)

```bash
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/pages/customers.vue \
   app/pages/customers.vue
```

**Update**: Replace `/api/customers` with `useMockCustomers()`

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'require-auth',
  title: 'Customers'
})

const { fetchCustomers } = useMockCustomers()
const customers = ref(await fetchCustomers())

// Update component references if needed
// OLD: <DeleteModal /> <AddModal />
// NEW: <CustomersDeleteModal /> <CustomersAddModal />
</script>
```

**Validation**: File copied, mock data integrated, components updated

---

### Step 4: Copy Inbox Page (5 minutes)

```bash
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/pages/inbox.vue \
   app/pages/inbox.vue
```

**Update**: Replace `/api/mails` with `useMockMails()`

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'require-auth',
  title: 'Inbox'
})

const { fetchMails } = useMockMails()
const mails = ref(await fetchMails())
</script>
```

**Validation**: File copied, mock data integrated

---

### Step 5: Copy Settings Wrapper (3 minutes)

```bash
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/pages/settings.vue \
   app/pages/settings.vue
```

**Update**: Add middleware

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'require-auth',
  title: 'Settings'
})
</script>
```

**Validation**: File copied, middleware added

---

### Step 6: Copy Settings Pages (8 minutes)

```bash
# Create settings directory if not exists
mkdir -p app/pages/settings

# Copy all settings sub-pages
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/pages/settings/index.vue \
   app/pages/settings/index.vue

cp /Users/uspro/Projects/nuxt-ui-dashboard/app/pages/settings/members.vue \
   app/pages/settings/members.vue

cp /Users/uspro/Projects/nuxt-ui-dashboard/app/pages/settings/notifications.vue \
   app/pages/settings/notifications.vue

cp /Users/uspro/Projects/nuxt-ui-dashboard/app/pages/settings/security.vue \
   app/pages/settings/security.vue
```

**Update settings/members.vue**: Replace `/api/members` with `useMockMembers()`

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'require-auth',
  title: 'Team Members'
})

const { fetchMembers } = useMockMembers()
const members = ref(await fetchMembers())

// Update component reference
// OLD: <MembersList />
// NEW: <SettingsMembersList />
</script>
```

**Update other settings pages**: Add middleware to all

**Validation**: 4 settings pages copied, middleware added, mock data integrated

---

### Step 7: Restore login.vue (2 minutes)

```bash
# Verify login.vue still exists (should not be overwritten)
cat app/pages/login.vue | head -n 5

# If missing, restore from backup
cp .backup/auth/app/pages/login.vue app/pages/login.vue
```

**Validation**: login.vue exists and contains auth logic (not overwritten)

---

### Step 8: Verify Route Structure (3 minutes)

```bash
# List all pages
find app/pages -type f -name "*.vue" | sort

# Expected routes:
# /                     → index.vue
# /login                → login.vue
# /customers            → customers.vue
# /inbox                → inbox.vue
# /settings             → settings.vue
# /settings             → settings/index.vue
# /settings/members     → settings/members.vue
# /settings/notifications → settings/notifications.vue
# /settings/security    → settings/security.vue
```

**Validation**: 9 page files (including login.vue)

---

### Step 9: Test Navigation (5 minutes)

```bash
# Start dev server
pnpm dev
```

Visit routes manually:
- http://localhost:3000/ (should require auth)
- http://localhost:3000/login (should show login form)
- http://localhost:3000/customers (should require auth)
- http://localhost:3000/inbox (should require auth)
- http://localhost:3000/settings (should require auth)
- http://localhost:3000/settings/members (should require auth)

**Validation**: All routes accessible, auth redirects work, no 404s

---

### Step 10: Verify Mock Data Integration (5 minutes)

Check each page displays mock data:
- **index.vue**: Charts render with sales data
- **customers.vue**: Table shows customer list
- **inbox.vue**: Mail list displays
- **settings/members.vue**: Members list renders

**Validation**: All pages show data, no "Loading..." stuck state, no errors

---

## Todo List

- [ ] Backup login.vue (verify from Phase 01)
- [ ] Copy index.vue from source (replace target)
- [ ] Update index.vue: Replace API calls with useMockSales()
- [ ] Add middleware: 'require-auth' to index.vue
- [ ] Copy customers.vue from source
- [ ] Update customers.vue: Replace /api/customers with useMockCustomers()
- [ ] Update customers.vue: Fix component names (CustomersDeleteModal, CustomersAddModal)
- [ ] Add middleware to customers.vue
- [ ] Copy inbox.vue from source
- [ ] Update inbox.vue: Replace /api/mails with useMockMails()
- [ ] Add middleware to inbox.vue
- [ ] Copy settings.vue wrapper
- [ ] Copy settings/index.vue
- [ ] Copy settings/members.vue
- [ ] Update settings/members.vue: Replace /api/members with useMockMembers()
- [ ] Update settings/members.vue: Fix component name (SettingsMembersList)
- [ ] Copy settings/notifications.vue
- [ ] Copy settings/security.vue
- [ ] Add middleware to all 4 settings pages
- [ ] Verify login.vue still exists (not overwritten)
- [ ] Test all routes (no 404s)
- [ ] Verify auth redirects work (unauthenticated → /login)
- [ ] Test mock data displays on all pages
- [ ] Run typecheck (pnpm typecheck)

---

## Success Criteria

### File Structure
- ✅ 8 dashboard pages copied from source
- ✅ login.vue preserved (not overwritten)
- ✅ All pages in correct directories
- ✅ settings/ directory has 4 sub-pages

### Auth Integration
- ✅ All dashboard pages have `middleware: 'require-auth'`
- ✅ Unauthenticated users redirect to /login
- ✅ login.vue functional (can log in)
- ✅ Auth session persists after login

### Mock Data Integration
- ✅ index.vue uses useMockSales() for charts
- ✅ customers.vue uses useMockCustomers() for table
- ✅ inbox.vue uses useMockMails() for mail list
- ✅ settings/members.vue uses useMockMembers() for members
- ✅ No `/api/*` calls except `/api/auth/*`

### Code Quality
- ✅ `pnpm typecheck` passes
- ✅ No ESLint errors
- ✅ No console errors in browser
- ✅ All component references updated (renamed components)

### Functionality
- ✅ All routes accessible (no 404s)
- ✅ Navigation works (links between pages)
- ✅ Data displays correctly on all pages
- ✅ Loading states work (no stuck spinners)

---

## Risk Assessment

### High Risk
**Risk**: Overwriting login.vue (loses auth flow)
**Impact**: Critical (users can't log in)
**Probability**: Low (with backup and verification)
**Mitigation**: Backup in Phase 01, verify preservation, restore if needed

### Medium Risk
**Risk**: Component name mismatches after rename
**Impact**: Moderate (pages break with "component not found")
**Probability**: Medium
**Mitigation**: Update all references in pages, typecheck, test each page

### Medium Risk
**Risk**: Mock data structure doesn't match page expectations
**Impact**: Moderate (pages don't render data)
**Probability**: Medium
**Mitigation**: Verify types in Phase 02, test with actual components, adjust mock data

### Low Risk
**Risk**: Middleware not added to all pages
**Impact**: Low (unprotected routes accessible)
**Probability**: Low (checklist verification)
**Mitigation**: Manual verification of all pages, test unauthenticated access

---

## Security Considerations

- All dashboard pages MUST have `middleware: 'require-auth'`
- login.vue should NOT have middleware (infinite redirect)
- Mock data should not expose real user information
- Session validation on every route access

---

## Next Steps

After completion:
1. Verify all success criteria met
2. Test complete user flow (login → dashboard → pages)
3. Proceed to [Phase 05: Merge Layouts](./phase-05-merge-layouts.md)

---

## Unresolved Questions

1. Should settings pages have nested middleware (settings.vue propagates)?
   → **Recommendation**: Add middleware to each page individually for explicitness

2. What if source pages use different data structures than mock composables?
   → **Solution**: Adjust mock composables in Phase 02 to match page expectations

3. Should we add page metadata (titles) to all pages?
   → **Recommendation**: Yes, use definePageMeta({ title: '...' }) for breadcrumbs/tabs
