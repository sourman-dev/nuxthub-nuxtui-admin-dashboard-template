# Planning Report: Merge Dashboard UI with Mock Data

**Date**: 2025-12-31
**Planner**: Planner Agent (04e95180)
**Plan Directory**: `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/plans/251231-1127-merge-dashboard-ui/`

---

## Executive Summary

Created comprehensive 7-phase implementation plan to merge nuxt-ui-dashboard UI into nuxthub-nuxtui-admin-dashboard-template while preserving authentication and converting all data to mocks.

**Total Effort**: 6 hours
**Approach**: Clean Slate Merge (recommended) vs Selective Merge
**Complexity**: High (14 components, 8 pages, full database cleanup)

---

## Plan Structure

### Main Plan
- **File**: `plan.md`
- **Content**: Two-approach comparison, phase breakdown, risk assessment, key decisions
- **Frontmatter**: YAML with status, priority, effort, tags

### Phase Files (7 total)

1. **Phase 01: Preparation** (30m)
   - Backup auth files with checksums
   - Install dependencies (@unovis, date-fns)
   - Create directory structure
   - Restoration script

2. **Phase 02: Mock Data Layer** (45m)
   - 5 mock data JSON files (notifications, members, mails, customers, sales)
   - 5 type-safe composables with async behavior
   - Client-side filtering/sorting
   - Type definitions in mocks.d.ts

3. **Phase 03: Merge Components** (1h Clean / 2h Selective)
   - 14 components from source to target
   - Resolve naming conflicts (DashboardUserMenu preserved)
   - Update import paths
   - Component registration verification

4. **Phase 04: Merge Pages** (30m Clean / 1.5h Selective)
   - 8 dashboard pages with mock data integration
   - Preserve login.vue (auth)
   - Add `middleware: 'require-auth'` to all pages
   - Replace API calls with mock composables

5. **Phase 05: Merge Layouts** (30m)
   - Dashboard layout with auth integration
   - useUserSession() for user display
   - Keyboard shortcuts (g-h, g-c, g-i, g-s, n)
   - NotificationsSlideover with mock data

6. **Phase 06: Cleanup Database** (30m)
   - Remove todos table from schema
   - Delete 5 todos API endpoints
   - Delete 2 todos pages
   - Generate migration to drop table
   - Update seed task

7. **Phase 07: Integration Testing** (45m)
   - Auth flow testing
   - All pages functional
   - Mock data displays correctly
   - Keyboard shortcuts work
   - Zero console errors
   - Responsive design verified

---

## Key Decisions Documented

### 1. Component Naming Conflicts
**Resolution**: Preserve target's DashboardUserMenu (has logout), rename source UserMenu → DashboardUserMenuSource

### 2. useDashboard.ts Merge
**Resolution**: Merge both composables, combine keyboard shortcuts from both projects

### 3. Mock Data Format
**Resolution**: Use source's Sale[] type structure for Unovis chart compatibility

### 4. Keyboard Shortcuts
**Resolution**: Merge all shortcuts (g-h, g-c, g-i, g-s, n) - no conflicts, additive

### 5. Todos Functionality
**Resolution**: Complete removal (not archival) - database + code

### 6. Migration Strategy
**Resolution**: All-at-once (single PR) - features interdependent

---

## Risk Assessment Summary

### High Risks (Mitigated)
- **Overwriting auth files** → Automated backup with checksums
- **Breaking logout** → Preserve DashboardUserMenu, test immediately

### Medium Risks
- **Component naming conflicts** → Systematic renaming, typecheck verification
- **useDashboard merge conflicts** → Deep comparison, merge shortcuts
- **Mock data structure mismatch** → Type safety, immediate testing

### Low Risks
- **JSON parsing errors** → Validation, try/catch
- **Client-only component issues** → Explicit .client.vue suffix

---

## Success Criteria Defined

### Functional Requirements (8 criteria)
- Login/logout flow functional
- All pages auth-protected
- Dashboard displays mock data
- No 404 errors for APIs
- Keyboard shortcuts work
- User menu shows user info
- Notifications slideover functional
- Settings pages navigate correctly

### Technical Requirements (6 criteria)
- Zero TypeScript errors
- Zero ESLint errors
- No console errors
- Database has only users table
- Auth session persists
- Mock data type-safe

### Code Quality (5 criteria)
- Follow code standards
- No dead code
- Realistic mock data
- Commented complex logic
- Clean git history

---

## File Manifest

### Created Files (8 total)
```
plans/251231-1127-merge-dashboard-ui/
├── plan.md                          (Main plan, 350+ lines)
├── phase-01-preparation.md          (Backup + deps, 280+ lines)
├── phase-02-mock-data-layer.md      (Mock data, 320+ lines)
├── phase-03-merge-components.md     (14 components, 360+ lines)
├── phase-04-merge-pages.md          (8 pages, 380+ lines)
├── phase-05-merge-layouts.md        (Dashboard layout, 280+ lines)
├── phase-06-cleanup-database.md     (Todos removal, 320+ lines)
└── phase-07-integration-testing.md  (40+ tests, 450+ lines)
```

**Total Lines**: ~2,700 lines of detailed planning documentation

---

## Approach Comparison

### Clean Slate Merge (RECOMMENDED)
- **Time**: 4 hours
- **Risk**: Medium-High (but mitigated with backups)
- **Pros**: Fast, consistent UI, clean slate
- **Cons**: Higher initial risk, larger diff
- **Best For**: New projects with minimal customization

### Selective Merge
- **Time**: 6 hours
- **Risk**: Low-Medium
- **Pros**: Safer, preserves customizations, easier rollback
- **Cons**: Time-consuming, cognitive load, potential inconsistencies
- **Best For**: Projects with significant customization

**Recommendation**: Clean Slate (target project is new with minimal customization)

---

## Implementation Guidance

### Critical Path
```
Phase 01 → Phase 02 → Phase 03 → Phase 04 → Phase 05 → Phase 07
(30m)     (45m)       (1h)        (30m)       (30m)       (45m)
```

**Total**: 4.5 hours (Phase 06 can run parallel)

### Parallelization Opportunity
Phase 06 (Database Cleanup) can run alongside Phase 03-05, saving 30 minutes.

### Checkpoints
- After Phase 01: Verify backup integrity
- After Phase 02: Test mock composables
- After Phase 03: Verify components render
- After Phase 05: Test navigation flow
- After Phase 07: Full integration test

---

## Unresolved Questions Tracked

### Phase 01 (Preparation)
1. Should backup be committed to git? → Private repo yes, public no
2. Backup nuxt.config.ts too? → Yes for safety

### Phase 02 (Mock Data)
1. Mock data images/avatars? → Use unavatar.io URLs
2. Data refresh mechanism? → Add refetch() method
3. Date format for sales? → ISO 8601 for date-fns compatibility

### Phase 03 (Components)
1. Keep both UserMenu versions? → Keep target (auth), optionally keep source for reference

### Phase 04 (Pages)
1. Settings nested middleware? → Add to each page explicitly
2. Page metadata titles? → Yes, use definePageMeta

### Phase 05 (Layouts)
1. Keep search functionality? → Yes if present
2. User avatar source? → Session data, fallback to initials

### Phase 06 (Database)
1. Keep data-fetch-example? → Delete if todos-specific
2. Document removed features? → Brief note in README

### Phase 07 (Testing)
1. Write automated tests? → Add to backlog (Phase 08)
2. Test different user roles? → Out of scope, add to RBAC backlog

---

## Next Actions

### Immediate
1. Review and approve plan
2. Begin Phase 01 (Preparation)

### Before Starting
- Ensure source project accessible at `/Users/uspro/Projects/nuxt-ui-dashboard/`
- Verify target project clean (no uncommitted changes)
- Read all phase files for full context

### After Completion
- Update plan.md status to "completed"
- Create git commit with meaningful message
- Archive plan to `plans/archive/` (if applicable)
- Document lessons learned

---

## Plan Quality Metrics

- ✅ All phases have context links
- ✅ Each phase has YAML-like overview
- ✅ Implementation steps are sequential and detailed
- ✅ Success criteria clearly defined
- ✅ Risk assessment for each phase
- ✅ Todo lists with checkboxes
- ✅ Unresolved questions documented
- ✅ Security considerations included
- ✅ Rollback strategies defined
- ✅ File paths are absolute
- ✅ Effort estimates realistic
- ✅ Dependencies mapped
- ✅ Validation steps for each action

---

## Compliance with Requirements

### Plan File Format
- ✅ YAML frontmatter with all required fields
- ✅ Title, description, status, priority, effort, branch, tags, created date

### Documentation Standards
- ✅ YAGNI, KISS, DRY principles applied
- ✅ Grammar sacrificed for concision
- ✅ Unresolved questions listed at end
- ✅ Development rules respected

### Phase Structure
- ✅ Context links (parent, prev, next, docs)
- ✅ Overview (date, description, priority, status, effort)
- ✅ Key Insights
- ✅ Requirements (must/should/nice)
- ✅ Architecture (where applicable)
- ✅ Related code files (absolute paths)
- ✅ Implementation steps (detailed, sequential)
- ✅ Todo lists
- ✅ Success criteria
- ✅ Risk assessment
- ✅ Security considerations
- ✅ Next steps

---

## Recommendations

### Pre-Implementation
1. Review research reports again
2. Test source project locally (ensure it works)
3. Create new branch for merge
4. Backup entire project (git commit)

### During Implementation
1. Follow phases sequentially (don't skip)
2. Run typecheck after each phase
3. Test components immediately after creation
4. Document any deviations from plan

### Post-Implementation
1. Run full test suite (Phase 07)
2. Create comprehensive git commit
3. Update documentation (README, changelog)
4. Archive todos backup (for reference)

---

## Conclusion

Comprehensive 7-phase plan created with:
- **Two approaches** (Clean Slate recommended)
- **6-hour effort** estimate (4h clean, 6h selective)
- **40+ test cases** for validation
- **All critical questions** addressed
- **Risk mitigation** strategies defined
- **Rollback plans** documented
- **Type safety** ensured throughout
- **Auth preservation** as top priority

Plan is ready for execution. All phases are detailed, actionable, and validated against requirements.

---

**Plan Files**:
- Main: `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/plans/251231-1127-merge-dashboard-ui/plan.md`
- Phases: 7 files in same directory

**Session State**: Updated to track active plan
