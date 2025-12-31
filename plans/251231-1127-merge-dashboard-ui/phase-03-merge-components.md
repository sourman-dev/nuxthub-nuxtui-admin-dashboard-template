# Phase 03: Merge Components

## Context Links
- **Parent Plan**: [Merge Dashboard UI Plan](./plan.md)
- **Previous Phase**: [Phase 02: Mock Data Layer](./phase-02-mock-data-layer.md)
- **Next Phase**: [Phase 04: Merge Pages](./phase-04-merge-pages.md)
- **Source Analysis**: [researcher-01-source-project.md](./research/researcher-01-source-project.md)

---

## Overview

**Date**: 2025-12-31
**Description**: Merge 14 dashboard components from source to target, resolve naming conflicts
**Priority**: P1 (Critical)
**Status**: Completed (2025-12-31 14:33)
**Effort**: 1 hour (Clean Slate) / 2 hours (Selective)

---

## Key Insights

- Source has 14 components organized by domain (home, inbox, customers, settings)
- Naming conflicts: UserMenu, TeamsMenu (both projects have similar components)
- Target's DashboardUserMenu has logout logic - MUST PRESERVE
- Source components are self-contained (minimal dependencies)
- Components use Nuxt UI v4 (compatible with target)

---

## Requirements

### Must Have
- ✅ All 14 source components copied to target
- ✅ Naming conflicts resolved (preserve target auth components)
- ✅ Import paths updated in all files
- ✅ No TypeScript errors after merge
- ✅ Components render without runtime errors

### Should Have
- ✅ Component registration verified (auto-import working)
- ✅ Props/emits types preserved
- ✅ Client-only components marked (.client.vue suffix)

### Nice to Have
- ⚪ Component documentation (JSDoc comments)
- ⚪ Prop validation with defaults

---

## Architecture

### Source Components (14 files)

**Layout/Shared** (3 files):
- `TeamsMenu.vue` → Rename to `DashboardTeamsMenuSource.vue` (conflict with target)
- `UserMenu.vue` → Rename to `DashboardUserMenuSource.vue` (conflict with target)
- `NotificationsSlideover.vue` → Keep name (target has same, overwrite)

**Home Domain** (6 files):
- `HomeDateRangePicker.vue` → Keep
- `HomeSales.vue` → Keep
- `HomeChart.client.vue` → Keep (.client suffix preserved)
- `HomeChart.server.vue` → Keep (.server suffix preserved)
- `HomeStats.vue` → Keep
- `HomePeriodSelect.vue` → Keep

**Inbox Domain** (2 files):
- `InboxMail.vue` → Keep
- `InboxList.vue` → Keep

**Customers Domain** (2 files):
- `DeleteModal.vue` → Rename to `CustomersDeleteModal.vue` (generic name)
- `AddModal.vue` → Rename to `CustomersAddModal.vue` (generic name)

**Settings Domain** (1 file):
- `MembersList.vue` → Rename to `SettingsMembersList.vue` (namespace)

### Target Components (Preserve)

**Auth-related** (CRITICAL - do not overwrite):
- `DashboardUserMenu.vue` → Keep (has logout logic)
- `DashboardTeamsMenu.vue` → Keep (may have custom logic)

**Overwrite**:
- `NotificationsSlideover.vue` → Overwrite with source version

---

## Related Code Files

### Source Files (to copy from)
Located in: `/Users/uspro/Projects/nuxt-ui-dashboard/app/components/`
- All 14 component files listed above

### Target Location
Copy to: `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/components/`

### Files to Preserve
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/components/DashboardUserMenu.vue`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/components/DashboardTeamsMenu.vue`

---

## Implementation Steps (Clean Slate Approach)

### Step 1: List Source Components (2 minutes)

```bash
# Navigate to source project
cd /Users/uspro/Projects/nuxt-ui-dashboard

# List all components with paths
find app/components -type f -name "*.vue" | sort
```

**Validation**: 14 component files listed

---

### Step 2: Copy Shared Components (5 minutes)

```bash
# Copy NotificationsSlideover (overwrite target)
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/components/NotificationsSlideover.vue \
   /Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/components/

# Copy TeamsMenu with new name
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/components/TeamsMenu.vue \
   /Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/components/DashboardTeamsMenuSource.vue

# Copy UserMenu with new name
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/components/UserMenu.vue \
   /Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/components/DashboardUserMenuSource.vue
```

**Validation**: 3 files copied, target's DashboardUserMenu.vue still exists

---

### Step 3: Copy Home Components (8 minutes)

```bash
cd /Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template

# Copy all Home* components
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/components/HomeDateRangePicker.vue app/components/
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/components/HomeSales.vue app/components/
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/components/HomeChart.client.vue app/components/
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/components/HomeChart.server.vue app/components/
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/components/HomeStats.vue app/components/
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/components/HomePeriodSelect.vue app/components/
```

**Validation**: 6 Home* components in target app/components/

---

### Step 4: Copy Inbox Components (3 minutes)

```bash
# Copy Inbox components
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/components/InboxMail.vue app/components/
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/components/InboxList.vue app/components/
```

**Validation**: 2 Inbox* components copied

---

### Step 5: Copy Customer Components (5 minutes)

```bash
# Copy and rename customer modals
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/components/DeleteModal.vue \
   app/components/CustomersDeleteModal.vue

cp /Users/uspro/Projects/nuxt-ui-dashboard/app/components/AddModal.vue \
   app/components/CustomersAddModal.vue
```

**Validation**: 2 Customer* components copied with new names

---

### Step 6: Copy Settings Components (3 minutes)

```bash
# Copy and rename settings components
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/components/MembersList.vue \
   app/components/SettingsMembersList.vue
```

**Validation**: 1 Settings* component copied

---

### Step 7: Update Component References (10 minutes)

Update import statements in renamed components:

**In CustomersDeleteModal.vue**:
- No imports to update (likely self-contained)

**In CustomersAddModal.vue**:
- No imports to update

**In SettingsMembersList.vue**:
- Update any `<DeleteModal>` → `<CustomersDeleteModal>`
- Update any `<AddModal>` → `<CustomersAddModal>`

**In DashboardTeamsMenuSource.vue**:
- Review for any auth-related logic (should have none)

**In DashboardUserMenuSource.vue**:
- Review for any auth-related logic (should reference session)

**Validation**: `pnpm typecheck` passes

---

### Step 8: Update Layout Files (8 minutes)

If source layout references `<UserMenu>` or `<TeamsMenu>`, update to use target's preserved components:

**Check files**:
- `app/layouts/dashboard.vue` (target)
- Any page that imports shared components

**Replace**:
- `<UserMenu>` → `<DashboardUserMenu>` (target's auth version)
- `<TeamsMenu>` → `<DashboardTeamsMenu>` (target's version)

**Validation**: No broken imports, components render

---

### Step 9: Verify Component Registration (5 minutes)

```bash
# Run dev server
pnpm dev

# Check auto-import (Nuxt DevTools)
# Navigate to http://localhost:3000/__nuxt_devtools__/
# Components tab should show all 14+ components
```

**Validation**: All components registered, no "component not found" errors

---

### Step 10: Type Check (3 minutes)

```bash
# Run TypeScript type check
pnpm typecheck
```

**Expected Output**: No errors

**Validation**: Clean type check

---

### Step 11: Test Component Imports (8 minutes)

Create temporary test page `app/pages/test-components.vue`:

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'require-auth'
})
</script>

<template>
  <div class="p-8 space-y-4">
    <h1>Component Test</h1>

    <!-- Home Components -->
    <HomeStats />
    <HomeSales />
    <HomeDateRangePicker />
    <HomePeriodSelect />

    <!-- Inbox Components -->
    <InboxList />

    <!-- Customer Components -->
    <CustomersDeleteModal />
    <CustomersAddModal />

    <!-- Settings Components -->
    <SettingsMembersList />

    <!-- Shared Components -->
    <NotificationsSlideover />
  </div>
</template>
```

Visit `/test-components` and verify no errors.

**Validation**: All components render, no console errors

---

## Todo List

### Clean Slate Approach
- [x] List all 14 source components
- [x] Copy NotificationsSlideover.vue (overwrite)
- [x] Copy TeamsMenu.vue → DashboardTeamsMenuSource.vue
- [x] Copy UserMenu.vue → DashboardUserMenuSource.vue
- [x] Copy 6 Home* components
- [x] Copy 2 Inbox* components
- [x] Copy DeleteModal.vue → CustomersDeleteModal.vue
- [x] Copy AddModal.vue → CustomersAddModal.vue
- [x] Copy MembersList.vue → SettingsMembersList.vue
- [x] Update component references in renamed files
- [x] Update layout imports (use target's DashboardUserMenu)
- [x] Verify target's DashboardUserMenu.vue still exists
- [x] Run typecheck (pnpm typecheck)
- [x] Create test-components.vue page
- [x] Test all components render without errors
- [x] Remove test-components.vue page

### Selective Approach (Alternative)
- [ ] Copy components one-by-one
- [ ] Test each component individually
- [ ] Resolve conflicts manually
- [ ] Update imports incrementally
- [ ] Type check after each component

---

## Success Criteria

### File Structure
- ✅ All 14 source components copied to target
- ✅ Target's DashboardUserMenu.vue preserved (not overwritten)
- ✅ Target's DashboardTeamsMenu.vue preserved
- ✅ No duplicate component names (all conflicts resolved)

### Naming Conventions
- ✅ Home components: `Home*.vue` (6 files)
- ✅ Inbox components: `Inbox*.vue` (2 files)
- ✅ Customer components: `Customers*.vue` (2 files)
- ✅ Settings components: `Settings*.vue` (1 file)
- ✅ Shared components: NotificationsSlideover.vue

### Code Quality
- ✅ `pnpm typecheck` passes with no errors
- ✅ No ESLint errors (`pnpm lint`)
- ✅ All components auto-import correctly
- ✅ No broken imports or missing dependencies

### Functionality
- ✅ All components render without runtime errors
- ✅ Client-only components work (.client.vue suffix)
- ✅ Props/emits types preserved
- ✅ Auth components still functional (DashboardUserMenu logout works)

---

## Risk Assessment

### High Risk
**Risk**: Overwriting DashboardUserMenu.vue (loses logout functionality)
**Impact**: Critical (auth breaks)
**Probability**: Low (with careful naming)
**Mitigation**: Backup in Phase 01, rename source UserMenu, verify preservation

### Medium Risk
**Risk**: Component import path mismatches after rename
**Impact**: Moderate (components don't render)
**Probability**: Medium
**Mitigation**: Global search for old names, update all references, typecheck

### Low Risk
**Risk**: Client-only components lose .client.vue suffix
**Impact**: Low (SSR hydration warnings)
**Probability**: Low (explicit copy with suffix)
**Mitigation**: Verify suffix preserved, test in dev mode

---

## Security Considerations

- Source components should not contain hardcoded credentials
- Avatar URLs should use secure HTTPS sources
- No XSS vulnerabilities in rendered content
- Props should validate user input (if accepting external data)

---

## Next Steps

After completion:
1. Verify all success criteria met
2. Delete test-components.vue page
3. Commit component changes to git
4. Proceed to [Phase 04: Merge Pages](./phase-04-merge-pages.md)

---

## Unresolved Questions

1. Should we keep both UserMenu versions (target + source)?
   → **Decision**: Keep target's DashboardUserMenu (auth), optionally keep source as DashboardUserMenuSource for reference

2. What if target's DashboardTeamsMenu has custom logic?
   → **Recommendation**: Compare both files, merge custom logic into source version if needed

3. Should component tests be written?
   → **Decision**: Out of scope for this phase, add to backlog for Phase 08 (future)
