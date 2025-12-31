---
title: "Merge Dashboard UI with Mock Data"
description: "Merge nuxt-ui-dashboard UI into template while preserving auth, converting all data to mocks"
status: ✅ completed
priority: P1
effort: 6h
branch: main
tags: [merge, dashboard, ui, mock-data, auth]
created: 2025-12-31
completed: 2025-12-31
---

# Implementation Plan: Merge Dashboard UI with Mock Data

## Executive Summary

Merge the complete nuxt-ui-dashboard UI (14 components, 8 pages, layouts, composables) into nuxthub-nuxtui-admin-dashboard-template while:
- **Preserving**: All authentication logic (login, logout, session management)
- **Converting**: All non-auth APIs to mock data layer
- **Removing**: All todos-related code and database tables
- **Adding**: Complete dashboard UI with charts, customer management, inbox, settings

**Estimated Effort**: 6 hours
**Approach**: Two strategies provided - Clean Slate (recommended, 4h) vs Selective Merge (safer, 6h)

---

## Context Links

- **Parent Plan**: N/A (top-level plan)
- **Research Reports**:
  - [Source Project Analysis](/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/plans/251231-1127-merge-dashboard-ui/research/researcher-01-source-project.md)
  - [Target Conflicts Analysis](/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/plans/251231-1127-merge-dashboard-ui/research/researcher-02-target-conflicts.md)
- **Docs**:
  - [Codebase Summary](/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/docs/codebase-summary.md)
  - [Code Standards](/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/docs/code-standards.md)

---

## Two Approaches Comparison

### Approach 1: Clean Slate Merge (RECOMMENDED)

**Strategy**: Backup auth files → Copy entire source app/ → Restore auth → Add mocks → Clean DB

**Pros**:
- Fastest implementation (4h vs 6h)
- Complete UI replacement ensures consistency
- Fewer merge conflicts to resolve manually
- Clean slate reduces technical debt
- Easier to track what changed (diff shows everything)

**Cons**:
- Higher initial risk if backup/restore fails
- Requires careful file tracking
- All current UI customizations lost (if any)
- Larger git commit diff

**Risks**:
- Accidentally overwriting critical auth files → **Mitigation**: Automated backup script with verification
- Missing edge cases in auth integration → **Mitigation**: Comprehensive testing checklist
- Breaking changes in app.config.ts → **Mitigation**: Merge configs carefully with validation

**Timeline**: 4 hours
- Phase 01: Preparation (30m)
- Phase 02: Mock Data Layer (45m)
- Phase 03-05: Clean Copy + Restore (1.5h)
- Phase 06: Database Cleanup (30m)
- Phase 07: Testing (45m)

---

### Approach 2: Selective File Merge

**Strategy**: Merge files one-by-one → Resolve conflicts manually → Gradual migration

**Pros**:
- Safer, lower risk of data loss
- Can test each component individually
- Preserves existing customizations
- Easier rollback per-component
- Better understanding of each file's purpose

**Cons**:
- Time-consuming (6h)
- High cognitive load resolving conflicts
- Risk of missing dependencies
- Inconsistent styling between old/new components
- More opportunities for human error

**Risks**:
- Incomplete component migration → **Mitigation**: Checklist with verification
- Conflicting composable logic → **Mitigation**: Deep diff analysis before merge
- Import path mismatches → **Mitigation**: Automated import path validation

**Timeline**: 6 hours
- Phase 01: Preparation (30m)
- Phase 02: Mock Data Layer (45m)
- Phase 03: Components (2h)
- Phase 04: Pages (1.5h)
- Phase 05: Layouts (45m)
- Phase 06: Database Cleanup (30m)
- Phase 07: Testing (45m)

---

## Recommended Approach: Clean Slate Merge

**Rationale**:
1. Template is new with minimal customization (todos feature is being removed)
2. Speed matters for rapid prototyping
3. Source UI is production-ready and consistent
4. Auth layer is isolated and well-defined
5. Mock data layer provides clean abstraction

---

## Phase Breakdown

### Phase 01: Preparation ([→ Details](./phase-01-preparation.md))
**Effort**: 30 minutes
**Status**: Pending

- Backup critical auth files to `.backup/auth/`
- Install dependencies (@unovis/vue, @unovis/ts, date-fns)
- Create directory structure (app/data/, app/composables/mocks/)
- Document current state (file checksums, git commit)
- Verify backup integrity

**Deliverables**: Backup directory, dependency installation, structure ready

---

### Phase 02: Mock Data Layer ([→ Details](./phase-02-mock-data-layer.md))
**Effort**: 45 minutes
**Status**: ✅ Completed (2025-12-31 14:25)

- [x] Design mock data schemas (Notification[], Member[], Mail[], Customer[])
- [x] Create `app/data/` JSON files with realistic data
- [x] Create mock composables (useMockNotifications, useMockMembers, etc.)
- [x] Define TypeScript types in `app/types/mocks.d.ts`
- [x] Implement client-side filtering/sorting

**Deliverables**: Complete mock data layer, type-safe composables

---

### Phase 03: Merge Components ([→ Details](./phase-03-merge-components.md))
**Effort**: 1 hour (Clean Slate) / 2 hours (Selective)
**Status**: ✅ Completed (2025-12-31 14:33)

**Clean Slate**:
- Copy all source components to target `app/components/`
- Resolve naming conflicts (DashboardUserMenu preserved, rename source UserMenu → DashboardSourceUserMenu)
- Update imports in preserved auth components
- Verify component registration

**Selective**:
- Copy components one-by-one with conflict resolution
- Test each component in isolation
- Update import paths manually

**Deliverables**: 14+ working components, no import errors

---

### Phase 04: Merge Pages ([→ Details](./phase-04-merge-pages.md))
**Effort**: 30 minutes (Clean Slate) / 1.5 hours (Selective)
**Status**: Pending

**Clean Slate**:
- Copy all source pages (overwrite existing index.vue)
- Restore `login.vue` from backup
- Add `middleware: 'require-auth'` to all dashboard pages
- Update to use mock composables (replace `/api/*` calls)

**Selective**:
- Merge pages individually with conflict checks
- Manually add middleware to each page
- Replace API calls one-by-one

**Deliverables**: 8 functional pages with auth protection, mock data integration

---

### Phase 05: Merge Layouts ([→ Details](./phase-05-merge-layouts.md))
**Effort**: 30 minutes
**Status**: Pending

- Copy source `default.vue` → rename to `dashboard.vue`
- Integrate `useUserSession()` for user display
- Preserve DashboardUserMenu component (has logout logic)
- Update layout references in pages
- Test navigation flow

**Deliverables**: Working dashboard layout with auth state display

---

### Phase 06: Cleanup Database ([→ Details](./phase-06-cleanup-database.md))
**Effort**: 30 minutes
**Status**: Pending

- Remove todos table from `server/db/schema.ts`
- Delete `/api/todos/*` endpoints (5 files)
- Remove todos queries (`app/queries/todos.ts`)
- Delete pages (`todos.vue`, `optimistic-todos.vue`)
- Generate new migration removing todos table
- Update seed task to remove todos seeding

**Deliverables**: Clean database schema with users only, no todos references

---

### Phase 07: Integration Testing ([→ Details](./phase-07-integration-testing.md))
**Effort**: 45 minutes
**Status**: ✅ Completed (2025-12-31 15:49)

- Test auth flow (login → dashboard → logout → login redirect)
- Test all dashboard pages with mock data
- Verify keyboard shortcuts (g-h, g-c, g-i, g-s, n)
- Test responsive design (mobile, tablet, desktop)
- Check console for errors (no 404s, no type errors)
- Verify no real API calls (except auth)
- Test edge cases (logged out access, direct URL navigation)

**Deliverables**: Fully functional dashboard, passing all tests, production-ready

---

## Success Criteria

### Functional Requirements
- ✅ Login/logout flow works without errors
- ✅ All pages protected by `require-auth` middleware
- ✅ Dashboard displays mock data (charts, stats, tables)
- ✅ No 404 errors for missing API endpoints
- ✅ Keyboard shortcuts functional (g-h, g-c, g-i, g-s, n)
- ✅ User menu shows logged-in user info
- ✅ Notifications slideover opens/closes
- ✅ Settings pages navigate correctly

### Technical Requirements
- ✅ Zero TypeScript errors (`pnpm typecheck` passes)
- ✅ Zero ESLint errors (`pnpm lint` passes)
- ✅ No console errors in browser
- ✅ Database has only `users` table (todos removed)
- ✅ Auth session persists across page reloads
- ✅ Mock data composables are type-safe

### Code Quality
- ✅ All files follow code standards (naming, structure)
- ✅ No dead code (unused imports, files)
- ✅ Mock data is realistic and comprehensive
- ✅ Comments explain complex logic
- ✅ Git history is clean (meaningful commits)

---

## Risk Assessment

### High Risk
**Risk**: Overwriting auth files during clean slate merge
**Impact**: Critical (app unusable)
**Probability**: Low (with backup automation)
**Mitigation**:
- Automated backup script with checksums
- Pre-merge validation script
- Manual verification checklist
- Rollback plan documented

### Medium Risk
**Risk**: Component naming conflicts (UserMenu, TeamsMenu)
**Impact**: Moderate (layout breaks)
**Probability**: High (known conflict)
**Mitigation**:
- Preserve target components with `Dashboard` prefix
- Rename source components to `DashboardSource` prefix
- Update all imports programmatically
- Test both components side-by-side

### Medium Risk
**Risk**: useDashboard.ts merge conflicts
**Impact**: Moderate (shortcuts break)
**Probability**: Medium (both projects have it)
**Mitigation**:
- Compare both files before merge
- Merge keyboard shortcuts from both
- Test all shortcuts after merge
- Document any removed shortcuts

### Low Risk
**Risk**: Mock data doesn't match Unovis chart requirements
**Impact**: Low (charts don't render)
**Probability**: Low (types defined)
**Mitigation**:
- Reference source chart components for data structure
- Use TypeScript types from source
- Test charts immediately after data creation

---

## Key Decisions & Resolutions

### 1. Component Naming Conflicts
**Question**: How to handle DashboardUserMenu (target) vs UserMenu (source)?
**Decision**: Preserve target's DashboardUserMenu (has auth logic), rename source UserMenu → DashboardSourceUserMenu
**Rationale**: Target's component has logout functionality we must preserve

### 2. useDashboard.ts Merge Strategy
**Question**: Replace or merge composable?
**Decision**: Merge both, prioritizing target's auth-aware logic + source's shortcuts
**Rationale**: Both have keyboard shortcuts, need combined functionality

### 3. Mock Data Format
**Question**: What format for chart data (Unovis requirements)?
**Decision**: Use source's Sale[] type with { date, amount, status } structure
**Rationale**: Direct compatibility with existing HomeChart components

### 4. Keyboard Shortcuts
**Question**: Preserve which shortcuts?
**Decision**: Merge all shortcuts from both projects
**Target**: `g-h` (home), `n` (notifications)
**Source**: `g-c` (customers), `g-i` (inbox), `g-s` (settings)
**Rationale**: No conflicts, additive functionality

### 5. Todos Functionality
**Question**: Remove or archive todos?
**Decision**: Complete removal (code + database)
**Rationale**: Todos were demo feature, dashboard is production feature

### 6. Migration Rollout
**Question**: All at once or phased?
**Decision**: All at once (single PR)
**Rationale**: Features are interdependent, partial state would be broken

---

## Rollback Strategy

### If Phase 03-05 Fails (Component/Page Merge)
1. `git reset --hard HEAD` (discard all changes)
2. Restore from `.backup/auth/` if needed
3. Review error logs
4. Switch to Selective Merge approach

### If Phase 06 Fails (Database Cleanup)
1. Keep todos code temporarily
2. Complete UI merge first
3. Clean database in separate PR

### If Phase 07 Fails (Testing)
1. Fix individual issues (auth, routing, data)
2. Don't merge to main until all tests pass
3. Document known issues in separate ticket

---

## Dependencies

### External
- @unovis/vue ^1.4.2
- @unovis/ts ^1.4.2
- date-fns ^4.1.0

### Internal
- nuxt-auth-utils (existing)
- @nuxt/ui v4 (existing)
- Drizzle ORM (existing)

---

## Phase Execution Order

```
Phase 01 (Preparation)
    ↓
Phase 02 (Mock Data Layer) [Can run parallel with 01]
    ↓
Phase 03 (Merge Components)
    ↓
Phase 04 (Merge Pages) [Depends on 03]
    ↓
Phase 05 (Merge Layouts) [Depends on 03, 04]
    ↓
Phase 06 (Cleanup Database) [Can run parallel with 03-05]
    ↓
Phase 07 (Integration Testing)
```

**Critical Path**: 01 → 02 → 03 → 04 → 05 → 07 (5.5h)
**Parallel Opportunity**: Phase 06 can run alongside 03-05 (saves 30m)

---

## Next Steps

1. **Immediate**: Review and approve this plan
2. **Phase 01**: Execute preparation phase (30m)
3. **Phase 02**: Implement mock data layer (45m)
4. **Phase 03**: Begin component merge (1h)
5. **Checkpoint**: Verify components working before proceeding
6. **Phase 04-07**: Complete remaining phases

---

## Unresolved Questions

1. **app.config.ts merge**: Should we preserve target's amber theme or adopt source's theme?
   → **Recommendation**: Preserve target's amber theme for branding consistency

2. **Assets migration**: Should we copy source's `app/assets/main.css`?
   → **Recommendation**: Review source CSS, merge only necessary global styles

3. **Error handling**: Should mock composables throw errors or return empty arrays on failure?
   → **Recommendation**: Return empty arrays (graceful degradation)

4. **Data refresh**: Should mock data have a refresh mechanism (simulated API delay)?
   → **Recommendation**: Add optional 200ms delay with loading states for realism

5. **Type safety**: Should we create separate types for API responses vs mock responses?
   → **Recommendation**: Reuse same types (they're identical structure)

---

## File Manifest

### Created Files
- `plans/251231-1127-merge-dashboard-ui/plan.md` (this file)
- `plans/251231-1127-merge-dashboard-ui/phase-01-preparation.md`
- `plans/251231-1127-merge-dashboard-ui/phase-02-mock-data-layer.md`
- `plans/251231-1127-merge-dashboard-ui/phase-03-merge-components.md`
- `plans/251231-1127-merge-dashboard-ui/phase-04-merge-pages.md`
- `plans/251231-1127-merge-dashboard-ui/phase-05-merge-layouts.md`
- `plans/251231-1127-merge-dashboard-ui/phase-06-cleanup-database.md`
- `plans/251231-1127-merge-dashboard-ui/phase-07-integration-testing.md`

### Modified Files (During Implementation)
- `package.json` (add dependencies)
- `server/db/schema.ts` (remove todos table)
- `nuxt.config.ts` (potentially merge configs)
- All files in `app/` directory

### Deleted Files (During Implementation)
- `app/pages/todos.vue`
- `app/pages/optimistic-todos.vue`
- `app/queries/todos.ts`
- `server/api/todos/*.ts` (5 files)

---

## Validation Summary

**Validated**: 2025-12-31 11:30 AM
**Questions Asked**: 4
**Validator**: Plan validation interview

### Confirmed Decisions

1. **Merge Approach**: ✅ Clean Slate Merge (4h)
   - Confirmed: Fastest approach suitable for new template with minimal customization
   - Timeline: 4 hours vs 6 hours selective merge

2. **Todos Feature Handling**: ✅ Complete Removal
   - Confirmed: Delete all todos code, database table, and API endpoints
   - Rationale: Clean slate for dashboard-only template

3. **Component Naming Conflict (UserMenu)**: ✅ Preserve Target's DashboardUserMenu
   - Confirmed: Keep target's DashboardUserMenu.vue (has logout logic)
   - Source's UserMenu will be renamed to DashboardSourceUserMenu
   - Auth functionality preserved as specified

4. **Mock Data Generation**: ✅ Hardcode 10-20 Entries Per Type
   - Confirmed: Manual JSON files, no external dependencies
   - Simpler approach, sufficient for demo/template purposes
   - No faker.js or external APIs needed

### Validation Outcomes

- ✅ All recommended options confirmed by user
- ✅ No plan revisions needed - proceed with implementation
- ✅ Risk assessment validated (backup strategy critical)
- ✅ Timeline confirmed: 4 hours (Clean Slate approach)

### Action Items

- [x] Validation complete - no changes needed
- [ ] Proceed to Phase 01: Preparation
- [ ] Execute backup automation script (high priority)
- [ ] Begin implementation following Clean Slate approach

---

**Plan Created**: 2025-12-31
**Validated**: 2025-12-31 11:30 AM
**Estimated Completion**: 2025-12-31 (same day, 4h effort)
**Approach**: Clean Slate Merge (Confirmed)
