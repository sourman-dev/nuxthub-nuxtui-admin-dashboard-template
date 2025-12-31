# Type Definition Conflicts - Resolution Report

**Date:** 2025-12-31 15:08
**Issue:** Type duplication - User, Mail, Member defined in both app/types/index.d.ts and app/types/mocks.d.ts with incompatible avatar types

---

## Root Cause Analysis

**Primary Issues:**
1. Duplicate type definitions across index.d.ts & mocks.d.ts
2. Avatar type mismatch: index uses `AvatarProps` from @nuxt/ui, mocks used plain object `{src, alt}`
3. Auth User conflict: `#auth-utils` User vs dashboard User types
4. Readonly wrapper prevented table mutations

**Impact:**
- Phase 04 files blocked by type errors
- DashboardUserMenu.vue failed - User missing name/email
- NotificationsSlideover.vue failed - optional sender/date not handled
- customers.vue failed - readonly ref incompatibility

---

## Solution Implemented

### 1. Consolidated Types (app/types/index.d.ts)
**Extended interfaces with all fields:**
```ts
// SaleStatus: added 'completed' | 'pending' | 'cancelled'
// Member: added id?, email?, date? fields
// Notification: made sender?, body?, date? optional + added title, description, icon, avatar, color, click
```

### 2. Deprecated Mocks File (app/types/mocks.d.ts)
**Re-exports from index.d.ts:**
```ts
// DEPRECATED: Import types from app/types/index.d.ts instead
export type { User, UserStatus, Mail, Member, Notification, Sale, SaleStatus, Period, Range } from './index'
```

### 3. Fixed Auth Type (shared/types/auth.d.ts)
**Separated User from UserSession:**
```ts
declare module '#auth-utils' {
  interface User { id, name, email }
  interface UserSession { user: User }
}
```

### 4. Fixed Avatar Props (DashboardUserMenu.vue)
**Changed `fallback` → `text`:**
```ts
// Before: { fallback: user.value?.name?.[0]... }
// After:  { text: user.value?.name?.[0]... }
```

### 5. Removed Readonly Wrappers
**Mock composables return mutable refs:**
- useMockCustomers: `return { data, status }` (was `readonly(data)`)
- useMockMails: same
- useMockMembers: same

### 6. Updated All Imports
**Changed from `~/types/mocks` → `~/types`:**
- useMockCustomers.ts
- useMockMails.ts
- useMockMembers.ts
- useMockSales.ts
- useMockNotifications.ts

---

## Validation Results

**Phase 04 Files: ✓ PASS**
- ✓ app/components/DashboardUserMenu.vue
- ✓ app/components/NotificationsSlideover.vue
- ✓ app/pages/customers.vue
- ✓ app/pages/inbox.vue

**Remaining Errors (out of scope):**
- app/pages/mock-test.vue - expects loading/fetch methods (not in new API)
- server/api/todos/* - db schema missing todos table (separate issue)

---

## Files Modified

**Type Definitions:**
- app/types/index.d.ts - extended SaleStatus, Member, Notification
- app/types/mocks.d.ts - deprecated, re-exports only
- shared/types/auth.d.ts - restructured User/UserSession

**Components:**
- app/components/DashboardUserMenu.vue - avatar text prop
- app/components/NotificationsSlideover.vue - optional chaining

**Composables:**
- app/composables/mocks/useMockCustomers.ts - removed readonly
- app/composables/mocks/useMockMails.ts - removed readonly, updated import
- app/composables/mocks/useMockMembers.ts - removed readonly, updated import
- app/composables/mocks/useMockSales.ts - updated import
- app/composables/mocks/useMockNotifications.ts - updated import

---

## Unresolved Questions

1. Should app/types/mocks.d.ts be deleted entirely or kept for backward compat?
2. Should mock-test.vue be updated to new composable API (no loading/fetch methods)?
3. Todos table schema missing - is this Phase 05 scope?
