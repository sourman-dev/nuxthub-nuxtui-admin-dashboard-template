# Phase 02: Mock Data Layer

## Context Links
- **Parent Plan**: [Merge Dashboard UI Plan](./plan.md)
- **Previous Phase**: [Phase 01: Preparation](./phase-01-preparation.md)
- **Next Phase**: [Phase 03: Merge Components](./phase-03-merge-components.md)
- **Source Analysis**: [researcher-01-source-project.md](./research/researcher-01-source-project.md)

---

## Overview

**Date**: 2025-12-31
**Description**: Create comprehensive mock data layer to replace all non-auth API endpoints
**Priority**: P1 (Critical)
**Status**: ✅ Completed (2025-12-31 14:25)
**Effort**: 45 minutes (actual)
**Code Review**: [code-reviewer-251231-1410-phase02.md](../reports/code-reviewer-251231-1410-phase02.md)

---

## Success Metrics
- **Type Safety**: 100% type coverage for mock data and composables
- **Coverage**: All 5 planned data types implemented (Notifications, Members, Mails, Customers, Sales)
- **Realism**: 90 days of historical sales data generated for chart validation
- **Performance**: Simulated 200ms latency implemented for loading state testing
- **Functionality**: Search, filtering, and pagination logic fully implemented in composables

---

## Key Insights

- Source project uses 4 main data types: Notification[], Member[], Mail[], User[] (customers)
- HomeChart requires Sale[] data with date/amount/status structure
- Mock composables should mimic real API behavior (async, filtering, sorting)
- Type safety is critical - reuse source types from research
- Client-side filtering enables search/filter features without backend

---

## Requirements

### Must Have
- ✅ Mock data files for all 5 data types (notifications, members, mails, customers, sales)
- ✅ Type-safe composables using source type definitions
- ✅ Async behavior with realistic delays (200ms)
- ✅ Client-side filtering by search term
- ✅ Client-side sorting by field

### Should Have
- ✅ Realistic data (names, emails, dates, amounts)
- ✅ Loading states in composables
- ✅ Error handling (return empty arrays on failure)
- ✅ Pagination support (limit/offset)

### Nice to Have
- ⚪ Data refresh mechanism
- ⚪ Optimistic updates simulation
- ⚪ TypeScript utility types for filters

---

## Architecture

### Type Definitions (from source)

```typescript
// app/types/mocks.d.ts

export interface User {
  id: number
  name: string
  email: string
  avatar?: {
    src: string
    alt?: string
  }
  status: UserStatus
  location: string
}

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'

export interface Mail {
  id: number
  subject: string
  from: {
    name: string
    email: string
    avatar?: {
      src: string
      alt?: string
    }
  }
  date: string
  body?: string
  unread?: boolean
}

export interface Member {
  id: number
  name: string
  username: string
  email: string
  avatar?: {
    src: string
    alt?: string
  }
  role: 'member' | 'owner'
  date: string
}

export interface Notification {
  id: number
  title: string
  description?: string
  icon?: string
  avatar?: {
    src: string
    alt?: string
  }
  color?: string
  click?: () => void
}

export interface Sale {
  date: string
  amount: number
  status: SaleStatus
}

export type SaleStatus = 'completed' | 'pending' | 'cancelled'

export interface Period {
  label: string
  value: string
}

export interface Range {
  start: Date
  end: Date
}
```

### Composable Pattern

```typescript
// app/composables/mocks/useMockNotifications.ts

export const useMockNotifications = () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchNotifications = async (): Promise<Notification[]> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      const response = await import('~/data/notifications.json')
      return response.default
    } catch (err) {
      error.value = err as Error
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchNotifications
  }
}
```

---

## Related Code Files

### Files to Create

**Type Definitions**:
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/types/mocks.d.ts`

**Mock Data Files**:
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/data/notifications.json`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/data/members.json`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/data/mails.json`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/data/customers.json`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/data/sales.json`

**Mock Composables**:
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/composables/mocks/useMockNotifications.ts`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/composables/mocks/useMockMembers.ts`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/composables/mocks/useMockMails.ts`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/composables/mocks/useMockCustomers.ts`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/composables/mocks/useMockSales.ts`

---

## Implementation Steps

### Step 1: Create Type Definitions (5 minutes)

Create `app/types/mocks.d.ts` with all 5 type definitions (User, Mail, Member, Notification, Sale) plus utility types (UserStatus, SaleStatus, Period, Range).

**Validation**: `pnpm typecheck` passes, no errors

---

### Step 2: Create Notification Mock Data (5 minutes)

Create `app/data/notifications.json`:

```json
[
  {
    "id": 1,
    "title": "New customer registered",
    "description": "John Doe just signed up",
    "icon": "i-lucide-user-plus",
    "color": "primary"
  },
  {
    "id": 2,
    "title": "Payment received",
    "description": "$1,234.56 from Acme Corp",
    "icon": "i-lucide-credit-card",
    "color": "green"
  },
  {
    "id": 3,
    "title": "Server maintenance scheduled",
    "description": "Downtime expected on Jan 15",
    "icon": "i-lucide-alert-triangle",
    "color": "amber"
  }
]
```

**Validation**: Valid JSON, matches Notification type

---

### Step 3: Create Members Mock Data (5 minutes)

Create `app/data/members.json` with 10+ members, mix of roles (member/owner), realistic names/emails.

**Validation**: Valid JSON, matches Member type

---

### Step 4: Create Mails Mock Data (7 minutes)

Create `app/data/mails.json` with 15+ emails, varied subjects/senders, some marked unread.

**Validation**: Valid JSON, matches Mail type

---

### Step 5: Create Customers Mock Data (7 minutes)

Create `app/data/customers.json` with 50+ customers, varied statuses (subscribed/unsubscribed/bounced), locations.

**Validation**: Valid JSON, matches User type

---

### Step 6: Create Sales Mock Data (5 minutes)

Create `app/data/sales.json` with 90 days of sales data, varied amounts/statuses for chart rendering.

**Validation**: Valid JSON, matches Sale type, date range covers last 90 days

---

### Step 7: Create useMockNotifications Composable (3 minutes)

Implement async fetch with 200ms delay, loading state, error handling.

**Validation**: Composable returns correct type, loading works, errors handled

---

### Step 8: Create useMockMembers Composable (3 minutes)

Include search filtering by name/email, role filtering.

**Validation**: Search works, role filter works

---

### Step 9: Create useMockMails Composable (3 minutes)

Include unread filtering, search by subject/from.

**Validation**: Filters work correctly

---

### Step 10: Create useMockCustomers Composable (3 minutes)

Include pagination (limit/offset), search by name/email, status filtering.

**Validation**: Pagination works, search works, status filter works

---

### Step 11: Create useMockSales Composable (2 minutes)

Include date range filtering for chart data.

**Validation**: Date range filter works, returns correct data structure

---

### Step 12: Integration Test (2 minutes)

Create test page that imports all composables and renders data to verify types.

**Validation**: No TypeScript errors, data renders correctly

---

## Todo List

- [x] Create app/types/mocks.d.ts with all type definitions
- [x] Create app/data/notifications.json (5 entries - exceeds 3+ requirement)
- [x] Create app/data/members.json (10 entries)
- [x] Create app/data/mails.json (16 entries - exceeds 15+ requirement)
- [x] Create app/data/customers.json (55 entries - exceeds 50+ requirement)
- [x] Create app/data/sales.json (90 days of data: Oct 3 - Dec 31, 2025)
- [x] Create useMockNotifications composable
- [x] Create useMockMembers composable with search/filter
- [x] Create useMockMails composable with search/filter
- [x] Create useMockCustomers composable with pagination
- [x] Create useMockSales composable with date filtering
- [x] **BLOCKER**: Fix type imports in app/pages/mock-test.vue (5 errors)
- [x] Run typecheck (pnpm typecheck) - must pass
- [x] Test composables in test page (created)
- [x] Verify all JSON files are valid

---

## Success Criteria

### Data Files
- ✅ All 5 JSON files created with realistic data
- ✅ notifications.json has 3+ entries
- ✅ members.json has 10+ entries with mixed roles
- ✅ mails.json has 15+ entries with unread flags
- ✅ customers.json has 50+ entries with varied statuses
- ✅ sales.json has 90 days of data (last 3 months)

### Type Safety
- ✅ app/types/mocks.d.ts defines all 5 main types
- ✅ `pnpm typecheck` passes with no errors
- ✅ All composables return correctly typed data

### Composable Features
- ✅ All composables have loading states
- ✅ All composables have error handling (return empty arrays)
- ✅ useMockMembers has search by name/email
- ✅ useMockMails has unread filtering
- ✅ useMockCustomers has pagination (limit/offset)
- ✅ useMockSales has date range filtering

### Performance
- ✅ Async delay is 200ms (realistic but fast)
- ✅ Filtering happens client-side (no delay)
- ✅ Large datasets (customers) don't block UI

---

## Risk Assessment

### Medium Risk
**Risk**: Mock data doesn't match Unovis chart requirements
**Impact**: Charts don't render in Phase 04
**Mitigation**: Reference source HomeChart.vue for exact data structure, test with chart component immediately

### Low Risk
**Risk**: JSON parsing errors (invalid format)
**Impact**: Composables return empty arrays
**Mitigation**: Validate JSON with linter, use try/catch in composables

### Low Risk
**Risk**: Type mismatches between mock data and types
**Impact**: TypeScript errors
**Mitigation**: Run typecheck after each composable, fix immediately

---

## Security Considerations

- Mock data should NOT contain real user information
- Email addresses should use example.com domain
- No sensitive data (passwords, tokens, keys)
- Avatar URLs should point to placeholder services (unavatar.io)

---

## Next Steps

After completion:
1. Verify all success criteria met
2. Test each composable individually
3. Proceed to [Phase 03: Merge Components](./phase-03-merge-components.md)

---

## Unresolved Questions

1. Should mock data include images/avatars?
   → **Recommendation**: Use unavatar.io URLs (e.g., `https://unavatar.io/github/username`)

2. How to handle data refresh? Add `refetch()` method?
   → **Recommendation**: Add `refetch()` that re-imports JSON (simulates API call)

3. Should we support optimistic updates?
   → **Decision**: No, out of scope for mock layer (complexity not justified)

4. Date format for sales data?
   → **Recommendation**: ISO 8601 format (`2025-12-01T00:00:00Z`) for compatibility with date-fns
