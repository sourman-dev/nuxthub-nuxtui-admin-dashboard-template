# Phase 07: Integration Testing

## Context Links
- **Parent Plan**: [Merge Dashboard UI Plan](./plan.md)
- **Previous Phase**: [Phase 06: Cleanup Database](./phase-06-cleanup-database.md)
- **All Phases**: Phases 01-06 must be completed
- **Final Phase**: This is the last phase

---

## Overview

**Date**: 2025-12-31
**Description**: Comprehensive testing of merged dashboard with auth, mock data, all components
**Priority**: P1 (Critical)
**Status**: Pending
**Effort**: 45 minutes

---

## Key Insights

- Integration testing validates entire merge (auth + UI + data)
- All components must work together (layout + pages + components)
- Mock data must display correctly in all contexts
- Keyboard shortcuts need end-to-end testing
- Auth flow is critical path (login → navigate → logout)
- Edge cases often reveal integration issues

---

## Requirements

### Must Have
- ✅ Auth flow tested (login → dashboard → logout)
- ✅ All pages accessible and functional
- ✅ Mock data displays on all pages
- ✅ Keyboard shortcuts work (g-h, g-c, g-i, g-s, n)
- ✅ No console errors (0 errors, 0 warnings)
- ✅ No 404 errors for API calls (except deliberate)
- ✅ TypeScript type check passes
- ✅ ESLint passes

### Should Have
- ✅ Responsive design tested (mobile, tablet, desktop)
- ✅ Navigation between pages works
- ✅ Loading states display correctly
- ✅ User menu shows logged-in user info

### Nice to Have
- ⚪ Performance testing (page load times)
- ⚪ Accessibility testing (keyboard nav, screen readers)
- ⚪ Cross-browser testing

---

## Architecture

### Test Coverage Matrix

| Area | Test Cases | Expected Result |
|------|------------|-----------------|
| **Auth** | Login, Logout, Session Persistence | User can authenticate, session persists |
| **Pages** | All 9 pages load | No 404s, no errors |
| **Data** | Mock data displays | Charts, tables, lists show data |
| **Navigation** | Links, shortcuts, breadcrumbs | All nav methods work |
| **Components** | All 14+ components render | No "component not found" errors |
| **Responsive** | Mobile, tablet, desktop | Layout adapts correctly |
| **Security** | Unauth access, protected routes | Redirects to /login work |

---

## Related Code Files

### Test Targets
- All files in `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/`
- All files in `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/server/api/auth/`

### Testing Tools
- Browser DevTools (Console, Network, Lighthouse)
- Nuxt DevTools (Components, Routes, State)
- TypeScript compiler (`vue-tsc`)
- ESLint

---

## Implementation Steps

### Step 1: Pre-Test Setup (3 minutes)

```bash
# Ensure clean state
rm -rf .nuxt .data
pnpm install

# Run database seed
pnpm dev &
sleep 5  # Wait for server to start
npx nitro task db:seed

# Kill dev server
kill %1
```

**Validation**: Clean build, database seeded with admin user

---

### Step 2: Type Check (2 minutes)

```bash
# Run TypeScript type check
pnpm typecheck
```

**Expected Output**: No errors

**Validation**: ✅ Type check passes

**Fix if Failed**: Review error messages, fix type issues, re-run

---

### Step 3: Lint Check (2 minutes)

```bash
# Run ESLint
pnpm lint
```

**Expected Output**: No errors

**Validation**: ✅ Lint passes

**Fix if Failed**: Run `pnpm lint:fix`, review auto-fixes, re-run

---

### Step 4: Start Dev Server (1 minute)

```bash
# Start dev server with verbose output
pnpm dev
```

**Expected Output**: Server starts on http://localhost:3000

**Validation**: ✅ Server running, no startup errors

---

### Step 5: Test Login Flow (5 minutes)

**Manual Steps**:
1. Navigate to http://localhost:3000
2. Should redirect to /login (unauthenticated)
3. Enter credentials: `admin@example.com` / `admin123`
4. Submit login form
5. Should redirect to dashboard (/)
6. Verify user name displays in navbar

**Expected Results**:
- ✅ Redirect to /login works
- ✅ Login form functional
- ✅ Auth succeeds (no errors)
- ✅ Redirects to dashboard
- ✅ User info displayed

**Console Check**: No errors during login

---

### Step 6: Test Dashboard Home (5 minutes)

**Manual Steps**:
1. On dashboard (/) page
2. Verify charts render (HomeChart component)
3. Verify stats display (HomeStats component)
4. Verify date range picker works (HomeDateRangePicker)
5. Verify sales data displays (HomeSales)

**Expected Results**:
- ✅ Charts render with mock sales data
- ✅ Stats show numbers (not loading forever)
- ✅ Date picker interactive
- ✅ No component errors

**Console Check**: No errors, no 404s for `/api/*` (should use mocks)

---

### Step 7: Test Customers Page (5 minutes)

**Manual Steps**:
1. Navigate to /customers (click nav or press `g-c`)
2. Verify customer table displays
3. Verify search works (if implemented)
4. Verify pagination works (if implemented)
5. Test "Add Customer" modal (if implemented)
6. Test "Delete Customer" modal (if implemented)

**Expected Results**:
- ✅ Table shows 50+ customers (mock data)
- ✅ No loading stuck state
- ✅ Modals open/close correctly
- ✅ No console errors

**Network Check**: No `/api/customers` calls (should use mock)

---

### Step 8: Test Inbox Page (5 minutes)

**Manual Steps**:
1. Navigate to /inbox (press `g-i`)
2. Verify mail list displays
3. Click on a mail (if implemented)
4. Verify mail detail shows (InboxMail component)
5. Test unread filtering (if implemented)

**Expected Results**:
- ✅ Mail list shows 15+ emails (mock data)
- ✅ Mail content displays correctly
- ✅ Unread/read states work
- ✅ No console errors

**Network Check**: No `/api/mails` calls

---

### Step 9: Test Settings Pages (7 minutes)

**Manual Steps**:
1. Navigate to /settings (press `g-s`)
2. Test /settings (general)
3. Test /settings/members
   - Verify members list displays (SettingsMembersList)
   - Verify 10+ members show
   - Test add/edit modals (if implemented)
4. Test /settings/notifications
5. Test /settings/security

**Expected Results**:
- ✅ All settings pages load
- ✅ Members list shows mock data
- ✅ No component errors
- ✅ Navigation between settings pages works

**Network Check**: No `/api/members` calls

---

### Step 10: Test Keyboard Shortcuts (5 minutes)

**Manual Steps**:
1. Press `g-h` → Should navigate to /
2. Press `g-c` → Should navigate to /customers
3. Press `g-i` → Should navigate to /inbox
4. Press `g-s` → Should navigate to /settings
5. Press `n` → Should open notifications slideover
6. Press `n` again → Should close slideover

**Expected Results**:
- ✅ All shortcuts work
- ✅ Navigation happens instantly
- ✅ Slideover toggles correctly

**Console Check**: No errors during shortcut use

---

### Step 11: Test Notifications (3 minutes)

**Manual Steps**:
1. Press `n` to open notifications slideover
2. Verify notifications display (mock data)
3. Verify slideover has close button
4. Click notification (if clickable)
5. Close slideover

**Expected Results**:
- ✅ Slideover opens
- ✅ Shows 3+ notifications (mock data)
- ✅ Close button works
- ✅ No console errors

**Network Check**: No `/api/notifications` calls (should use mock)

---

### Step 12: Test Logout Flow (3 minutes)

**Manual Steps**:
1. Click user menu in navbar
2. Click "Logout" button
3. Should call `/api/auth/logout`
4. Should redirect to /login
5. Session should be cleared (no auto-login)

**Expected Results**:
- ✅ Logout button works
- ✅ Session cleared
- ✅ Redirects to /login
- ✅ Cannot access dashboard without re-login

**Network Check**: `/api/auth/logout` called (200 OK)

---

### Step 13: Test Protected Routes (3 minutes)

**Manual Steps**:
1. Log out (should be at /login)
2. Try to access /customers directly (http://localhost:3000/customers)
3. Should redirect to /login
4. Try to access /inbox directly
5. Should redirect to /login

**Expected Results**:
- ✅ Unauthenticated users redirected to /login
- ✅ Protected routes not accessible
- ✅ No errors during redirect

---

### Step 14: Test Responsive Design (5 minutes)

**Manual Steps**:
1. Login and navigate to dashboard
2. Open DevTools → Toggle device toolbar
3. Test mobile (375px width):
   - Sidebar should collapse
   - Hamburger menu should appear
   - Content should be readable
4. Test tablet (768px width):
   - Sidebar should be collapsible
   - Layout should adapt
5. Test desktop (1920px width):
   - Sidebar should be visible
   - Full layout displayed

**Expected Results**:
- ✅ Mobile: Hamburger menu works
- ✅ Tablet: Layout adapts
- ✅ Desktop: Full layout
- ✅ No horizontal scroll
- ✅ No layout breaks

---

### Step 15: Console Error Check (2 minutes)

**Manual Steps**:
1. Open DevTools Console
2. Review all logged messages
3. Filter by "Errors" (should be 0)
4. Filter by "Warnings" (minimize, document if any)

**Expected Results**:
- ✅ 0 errors
- ✅ 0 critical warnings
- ⚠️ Minor warnings acceptable (document)

**Action if Errors**: Fix errors, re-test, iterate

---

### Step 16: Network Tab Check (2 minutes)

**Manual Steps**:
1. Open DevTools Network tab
2. Reload dashboard page
3. Review all requests
4. Look for 404s or failed requests

**Expected Results**:
- ✅ No 404 errors (except deliberate)
- ✅ `/api/auth/*` calls work (200 OK)
- ✅ No `/api/todos/*` calls
- ✅ No `/api/customers`, `/api/mails`, `/api/members` calls (using mocks)

**Action if Failed**: Identify source, fix API calls

---

## Todo List

### Pre-Test
- [ ] Clean build (.nuxt, .data)
- [ ] Install dependencies (pnpm install)
- [ ] Seed database (npx nitro task db:seed)
- [ ] Run typecheck (pnpm typecheck) - MUST PASS
- [ ] Run lint (pnpm lint) - MUST PASS
- [ ] Start dev server (pnpm dev)

### Auth Flow
- [ ] Test unauthenticated redirect to /login
- [ ] Test login with valid credentials
- [ ] Verify redirect to dashboard after login
- [ ] Verify user info displays in navbar
- [ ] Test session persistence (reload page)
- [ ] Test logout functionality
- [ ] Verify session cleared after logout
- [ ] Test protected route redirect (logout → /customers → /login)

### Page Testing
- [ ] Test / (dashboard) - charts, stats render
- [ ] Test /customers - table, pagination, modals
- [ ] Test /inbox - mail list, detail view
- [ ] Test /settings - general settings
- [ ] Test /settings/members - members list
- [ ] Test /settings/notifications
- [ ] Test /settings/security
- [ ] Verify login page accessible

### Data Display
- [ ] Dashboard charts show sales data
- [ ] Customers table shows 50+ rows
- [ ] Inbox shows 15+ emails
- [ ] Settings members shows 10+ members
- [ ] Notifications slideover shows 3+ items

### Keyboard Shortcuts
- [ ] Test g-h (home navigation)
- [ ] Test g-c (customers navigation)
- [ ] Test g-i (inbox navigation)
- [ ] Test g-s (settings navigation)
- [ ] Test n (notifications toggle)

### Responsive Design
- [ ] Test mobile (375px) - hamburger menu works
- [ ] Test tablet (768px) - layout adapts
- [ ] Test desktop (1920px) - full layout

### Console & Network
- [ ] Console: 0 errors
- [ ] Console: 0 critical warnings
- [ ] Network: No 404s (except expected)
- [ ] Network: No /api/todos calls
- [ ] Network: Auth endpoints work (200 OK)
- [ ] Network: No real API calls for mock data

---

## Success Criteria

### Auth Flow
- ✅ Login works with valid credentials
- ✅ Unauthenticated users redirect to /login
- ✅ Session persists across page reloads
- ✅ Logout clears session and redirects
- ✅ Protected routes require authentication

### Page Functionality
- ✅ All 9 pages load without errors
- ✅ Dashboard charts render with data
- ✅ Customer table displays mock data
- ✅ Inbox shows mail list
- ✅ Settings pages functional

### Data Integration
- ✅ All mock composables work
- ✅ No real API calls (except auth)
- ✅ Data displays correctly in components
- ✅ Loading states work (no stuck spinners)

### Navigation
- ✅ All 5 keyboard shortcuts work (g-h, g-c, g-i, g-s, n)
- ✅ Sidebar navigation works
- ✅ Page transitions smooth
- ✅ No broken links

### Code Quality
- ✅ `pnpm typecheck` passes (0 errors)
- ✅ `pnpm lint` passes (0 errors)
- ✅ Console has 0 errors
- ✅ No 404 errors in network tab

### Responsive Design
- ✅ Mobile layout works (hamburger menu)
- ✅ Tablet layout adapts
- ✅ Desktop layout full-featured
- ✅ No horizontal scroll at any size

### Security
- ✅ Auth endpoints work (/api/auth/login, /api/auth/logout)
- ✅ Protected routes redirect unauthenticated users
- ✅ Session management functional
- ✅ No auth bypass possible

---

## Risk Assessment

### High Risk
**Risk**: Critical bug found during testing
**Impact**: High (blocks merge)
**Probability**: Medium
**Mitigation**: Fix immediately, re-test full flow, document fix

### Medium Risk
**Risk**: Mock data doesn't match component expectations
**Impact**: Moderate (components don't render)
**Probability**: Low (types ensure compatibility)
**Mitigation**: Adjust mock data structure, re-test, update types

### Low Risk
**Risk**: Minor UI glitches on edge screen sizes
**Impact**: Low (cosmetic issues)
**Probability**: Medium
**Mitigation**: Document issues, fix in follow-up PR

---

## Security Considerations

- Test auth bypass attempts (direct URL access)
- Verify session token cleared on logout
- Check for XSS vulnerabilities in mock data rendering
- Ensure no sensitive data logged to console

---

## Next Steps

After completion:
1. Document all test results
2. Fix any critical issues found
3. Create git commit with all changes
4. Update main plan.md status to "completed"
5. Write summary report

---

## Test Results Template

```markdown
# Integration Test Results
Date: 2025-12-31
Tester: [Name]

## Summary
- Total Tests: 40+
- Passed: [X]
- Failed: [Y]
- Blocked: [Z]

## Auth Flow: ✅ PASS / ❌ FAIL
- Login: [PASS/FAIL]
- Logout: [PASS/FAIL]
- Protected Routes: [PASS/FAIL]

## Pages: ✅ PASS / ❌ FAIL
- Dashboard (/): [PASS/FAIL]
- Customers: [PASS/FAIL]
- Inbox: [PASS/FAIL]
- Settings: [PASS/FAIL]

## Mock Data: ✅ PASS / ❌ FAIL
- Sales data: [PASS/FAIL]
- Customers data: [PASS/FAIL]
- Mails data: [PASS/FAIL]
- Members data: [PASS/FAIL]

## Code Quality: ✅ PASS / ❌ FAIL
- TypeCheck: [PASS/FAIL]
- Lint: [PASS/FAIL]
- Console Errors: [0/N]

## Issues Found
1. [Issue description] - [Severity: High/Medium/Low]
2. ...

## Recommendations
- [Any recommendations for future improvements]
```

---

## Unresolved Questions

1. Should we write automated tests (Playwright, Vitest)?
   → **Recommendation**: Yes, add to backlog for Phase 08 (future work)

2. What if test reveals breaking issues?
   → **Decision**: Fix immediately, re-run all tests, delay merge if needed

3. Should we test with different user roles?
   → **Decision**: Out of scope (only admin user exists), add to backlog for RBAC feature

4. Performance benchmarks (page load times)?
   → **Recommendation**: Use Lighthouse, document baseline, optimize in follow-up PR
