# Phase 05: Merge Layouts

## Context Links
- **Parent Plan**: [Merge Dashboard UI Plan](./plan.md)
- **Previous Phase**: [Phase 04: Merge Pages](./phase-04-merge-pages.md)
- **Next Phase**: [Phase 06: Cleanup Database](./phase-06-cleanup-database.md)
- **Dependencies**: Phase 03 (Components), Phase 04 (Pages)

---

## Overview

**Date**: 2025-12-31
**Description**: Merge dashboard layout from source, integrate auth state, preserve logout functionality
**Priority**: P1 (Critical)
**Status**: Pending
**Effort**: 30 minutes

---

## Key Insights

- Source has `default.vue` layout with sidebar, navbar, slideouts
- Target has `dashboard.vue` layout (similar structure)
- Need to integrate `useUserSession()` for user display
- DashboardUserMenu has logout - must be integrated into layout
- Keyboard shortcuts from useDashboard.ts need to work in layout
- NotificationsSlideover needs notification data from mock composable

---

## Requirements

### Must Have
- ✅ Source layout merged into target (overwrite dashboard.vue)
- ✅ `useUserSession()` integrated (show logged-in user)
- ✅ DashboardUserMenu component integrated (logout works)
- ✅ Keyboard shortcuts functional (g-h, g-c, g-i, g-s, n)
- ✅ Navigation links correct (all routes)

### Should Have
- ✅ NotificationsSlideover uses mock data
- ✅ Teams menu functional (if applicable)
- ✅ Search functionality (if in source layout)
- ✅ Responsive design (mobile nav)

### Nice to Have
- ⚪ Breadcrumb navigation
- ⚪ User avatar from session
- ⚪ Online/offline status indicator

---

## Architecture

### Source Layout Structure
```vue
<!-- default.vue from source -->
<template>
  <UDashboardLayout>
    <UDashboardPanel>
      <!-- Sidebar with navigation -->
      <UDashboardNavbar>
        <template #left>
          <TeamsMenu />
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <!-- Navigation links -->
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />

    <UDashboardSearch />
    <NotificationsSlideover />
  </UDashboardLayout>
</template>
```

### Target Layout Modifications
```vue
<!-- dashboard.vue (updated) -->
<script setup lang="ts">
// Import auth composable
const { user, loggedIn } = useUserSession()

// Import dashboard state
const { isNotificationsSlideoverOpen } = useDashboard()

// Fetch notifications for slideover
const { fetchNotifications } = useMockNotifications()
const notifications = ref(await fetchNotifications())
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel>
      <UDashboardNavbar>
        <template #left>
          <DashboardTeamsMenu />
        </template>
        <template #right>
          <!-- Use target's DashboardUserMenu with auth -->
          <DashboardUserMenu :user="user" />
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <!-- Navigation links -->
        <UNavigationMenu>
          <UNavigationMenuItem to="/" label="Home" icon="i-lucide-home" />
          <UNavigationMenuItem to="/customers" label="Customers" icon="i-lucide-users" />
          <UNavigationMenuItem to="/inbox" label="Inbox" icon="i-lucide-inbox" />
          <UNavigationMenuItem to="/settings" label="Settings" icon="i-lucide-settings" />
        </UNavigationMenu>
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />

    <UDashboardSearch />
    <NotificationsSlideover v-model:open="isNotificationsSlideoverOpen" :notifications="notifications" />
  </UDashboardLayout>
</template>
```

---

## Related Code Files

### Source Files
- `/Users/uspro/Projects/nuxt-ui-dashboard/app/layouts/default.vue`

### Target Files
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/layouts/dashboard.vue`

### Components Used
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/components/DashboardUserMenu.vue` (auth)
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/components/DashboardTeamsMenu.vue`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/components/NotificationsSlideover.vue`

### Composables
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/composables/useDashboard.ts`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/composables/mocks/useMockNotifications.ts`

---

## Implementation Steps

### Step 1: Compare Layouts (5 minutes)

```bash
# View source layout
cat /Users/uspro/Projects/nuxt-ui-dashboard/app/layouts/default.vue

# View target layout
cat app/layouts/dashboard.vue

# Note differences:
# - Component names (UserMenu vs DashboardUserMenu)
# - Auth integration
# - Navigation links
# - Keyboard shortcuts
```

**Validation**: Understand differences before merge

---

### Step 2: Copy Source Layout (3 minutes)

```bash
# Copy source default.vue as dashboard.vue (overwrite)
cp /Users/uspro/Projects/nuxt-ui-dashboard/app/layouts/default.vue \
   app/layouts/dashboard.vue
```

**Validation**: File copied

---

### Step 3: Add Auth Integration (5 minutes)

Update `app/layouts/dashboard.vue` script section:

```vue
<script setup lang="ts">
// Auth session
const { user, loggedIn } = useUserSession()

// Dashboard state (keyboard shortcuts, notifications)
const { isNotificationsSlideoverOpen } = useDashboard()

// Mock notifications data
const { fetchNotifications, loading } = useMockNotifications()
const notifications = ref<Notification[]>([])

// Fetch notifications on mount
onMounted(async () => {
  notifications.value = await fetchNotifications()
})
</script>
```

**Validation**: `useUserSession` imported, user session available

---

### Step 4: Update Component References (7 minutes)

In template section, replace component names:

```vue
<!-- OLD (source) -->
<UserMenu />
<TeamsMenu />

<!-- NEW (target auth-aware) -->
<DashboardUserMenu :user="user" />
<DashboardTeamsMenu />
```

**Validation**: Components render, no import errors

---

### Step 5: Update Navigation Links (5 minutes)

Update sidebar navigation to match new routes:

```vue
<UDashboardSidebar>
  <UNavigationMenu>
    <UNavigationMenuItem
      to="/"
      label="Dashboard"
      icon="i-lucide-layout-dashboard"
      shortcut="g-h"
    />
    <UNavigationMenuItem
      to="/customers"
      label="Customers"
      icon="i-lucide-users"
      shortcut="g-c"
    />
    <UNavigationMenuItem
      to="/inbox"
      label="Inbox"
      icon="i-lucide-inbox"
      shortcut="g-i"
    />
    <UNavigationMenuItem
      to="/settings"
      label="Settings"
      icon="i-lucide-settings"
      shortcut="g-s"
    />
  </UNavigationMenu>
</UDashboardSidebar>
```

**Validation**: Navigation renders, links work

---

### Step 6: Integrate Notifications Slideover (5 minutes)

Update NotificationsSlideover binding:

```vue
<NotificationsSlideover
  v-model:open="isNotificationsSlideoverOpen"
  :notifications="notifications"
  :loading="loading"
/>
```

**Validation**: Slideover opens with keyboard shortcut `n`, shows mock data

---

### Step 7: Merge Keyboard Shortcuts (3 minutes)

Ensure `useDashboard.ts` has all shortcuts:

```typescript
// app/composables/useDashboard.ts
defineShortcuts({
  'g-h': () => navigateTo('/'),
  'g-c': () => navigateTo('/customers'),
  'g-i': () => navigateTo('/inbox'),
  'g-s': () => navigateTo('/settings'),
  'n': () => { isNotificationsSlideoverOpen.value = !isNotificationsSlideoverOpen.value }
})
```

**Validation**: All shortcuts work

---

### Step 8: Update Page Layouts (2 minutes)

Ensure all pages use `dashboard` layout:

```vue
<!-- In pages/index.vue, customers.vue, etc. -->
<script setup lang="ts">
definePageMeta({
  middleware: 'require-auth',
  layout: 'dashboard'  // Explicitly set layout
})
</script>
```

**Validation**: All pages use dashboard layout

---

### Step 9: Test Responsive Design (3 minutes)

```bash
pnpm dev
```

Test layout at different screen sizes:
- Desktop (>1024px): Sidebar visible
- Tablet (768-1024px): Collapsible sidebar
- Mobile (<768px): Hamburger menu

**Validation**: Layout responsive, mobile nav works

---

### Step 10: Verify Auth Display (2 minutes)

Login and verify:
- User name displays in navbar
- User avatar shows (if configured)
- Logout button works
- Session persists on refresh

**Validation**: Auth integration working

---

## Todo List

- [ ] Compare source default.vue vs target dashboard.vue
- [ ] Copy source default.vue → dashboard.vue (overwrite)
- [ ] Add useUserSession() import
- [ ] Add useDashboard() import
- [ ] Add useMockNotifications() import
- [ ] Update <UserMenu> → <DashboardUserMenu :user="user">
- [ ] Update <TeamsMenu> → <DashboardTeamsMenu>
- [ ] Update navigation links (/, /customers, /inbox, /settings)
- [ ] Add keyboard shortcuts to navigation items
- [ ] Update NotificationsSlideover binding (v-model, :notifications)
- [ ] Verify keyboard shortcuts in useDashboard.ts
- [ ] Add layout: 'dashboard' to all pages
- [ ] Test desktop layout (sidebar visible)
- [ ] Test tablet layout (collapsible sidebar)
- [ ] Test mobile layout (hamburger menu)
- [ ] Login and verify user display
- [ ] Test logout functionality
- [ ] Test keyboard shortcuts (g-h, g-c, g-i, g-s, n)
- [ ] Run typecheck (pnpm typecheck)

---

## Success Criteria

### Layout Structure
- ✅ dashboard.vue layout exists
- ✅ Sidebar with navigation menu
- ✅ Navbar with user menu
- ✅ NotificationsSlideover integrated

### Auth Integration
- ✅ User session displays in navbar
- ✅ Logged-in user name visible
- ✅ Logout button functional
- ✅ Session persists on page refresh

### Navigation
- ✅ All routes accessible via sidebar
- ✅ Active route highlighted
- ✅ Keyboard shortcuts work (g-h, g-c, g-i, g-s, n)
- ✅ Search functionality works (if applicable)

### Components
- ✅ DashboardUserMenu renders with auth
- ✅ DashboardTeamsMenu renders
- ✅ NotificationsSlideover shows mock data
- ✅ No component import errors

### Responsive Design
- ✅ Desktop: Sidebar visible
- ✅ Tablet: Collapsible sidebar
- ✅ Mobile: Hamburger menu
- ✅ No layout breaks at any screen size

### Code Quality
- ✅ `pnpm typecheck` passes
- ✅ No ESLint errors
- ✅ No console errors
- ✅ All pages use dashboard layout

---

## Risk Assessment

### High Risk
**Risk**: Breaking logout functionality during merge
**Impact**: Critical (users can't log out)
**Probability**: Low (preserved DashboardUserMenu)
**Mitigation**: Test logout immediately after merge, verify session cleared

### Medium Risk
**Risk**: Keyboard shortcuts conflict between source and target
**Impact**: Moderate (shortcuts don't work)
**Probability**: Low (merge both sets)
**Mitigation**: Test all shortcuts, document in useDashboard.ts

### Low Risk
**Risk**: Responsive layout breaks on mobile
**Impact**: Low (bad UX on mobile)
**Probability**: Low (Nuxt UI handles responsive)
**Mitigation**: Test on multiple screen sizes, adjust breakpoints if needed

---

## Security Considerations

- Layout should check `loggedIn` before rendering sensitive data
- User info from session should be sanitized before display
- Logout should clear all session data (handled by DashboardUserMenu)
- No sensitive data logged to console

---

## Next Steps

After completion:
1. Verify all success criteria met
2. Test complete user flow (login → navigate → logout)
3. Proceed to [Phase 06: Cleanup Database](./phase-06-cleanup-database.md)

---

## Unresolved Questions

1. Should we keep search functionality from source layout?
   → **Recommendation**: Yes if present, configure to search pages/content

2. What if target has custom sidebar items?
   → **Solution**: Merge both navigation menus, keep all items

3. Should user avatar be loaded from session or separate API?
   → **Decision**: Use session data (simpler), fallback to initials if no avatar
