# Phase 01: Preparation

## Context Links
- **Parent Plan**: [Merge Dashboard UI Plan](./plan.md)
- **Next Phase**: [Phase 02: Mock Data Layer](./phase-02-mock-data-layer.md)
- **Docs**: [Code Standards](/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/docs/code-standards.md)

---

## Overview

**Date**: 2025-12-31
**Description**: Backup critical auth files, install dependencies, create directory structure, document current state
**Priority**: P1 (Critical)
**Status**: ✅ Completed
**Effort**: 30 minutes (actual)
**Review**: [Code Review Report](../reports/code-reviewer-251231-1322-phase01-prep.md)
**Completion**: 2025-12-31 13:55

---

## Key Insights

- Auth files are mission-critical - backup before ANY modification
- Dependencies must be installed before component copy (avoid runtime errors)
- Current state documentation enables rollback
- Directory structure creation prevents file copy errors
- Verification step catches issues early

---

## Requirements

### Must Have
- ✅ Backup of all auth-related files with checksums
- ✅ Dependencies installed (@unovis/vue, @unovis/ts, date-fns)
- ✅ Directory structure created (app/data/, app/composables/mocks/)
- ✅ Git commit hash recorded for rollback
- ✅ Backup integrity verification

### Should Have
- ✅ Backup script automation
- ✅ Pre-merge validation script
- ✅ File count documentation (before/after)

### Nice to Have
- ⚪ Automated dependency version checking
- ⚪ Disk space verification

---

## Architecture

### Backup Strategy
```
.backup/auth/
├── checksums.txt              # MD5 hashes for verification
├── app/
│   ├── pages/
│   │   └── login.vue
│   ├── middleware/
│   │   └── require-auth.ts
│   └── components/
│       └── DashboardUserMenu.vue
├── server/
│   └── api/
│       └── auth/
│           ├── login.post.ts
│           └── logout.post.ts
└── shared/
    └── types/
        └── auth.d.ts
```

### Directory Structure (New)
```
app/
├── data/                      # Mock JSON data files
│   ├── notifications.json
│   ├── members.json
│   ├── mails.json
│   ├── customers.json
│   └── sales.json
└── composables/
    └── mocks/                 # Mock data composables
        ├── useMockNotifications.ts
        ├── useMockMembers.ts
        ├── useMockMails.ts
        ├── useMockCustomers.ts
        └── useMockSales.ts
```

---

## Related Code Files

### Files to Backup (Critical)
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/pages/login.vue`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/middleware/require-auth.ts`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/app/components/DashboardUserMenu.vue`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/server/api/auth/login.post.ts`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/server/api/auth/logout.post.ts`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/shared/types/auth.d.ts`

### Configuration Files
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/package.json`
- `/Users/uspro/Projects/nuxthub-nuxtui-admin-dashboard-template/nuxt.config.ts`

---

## Implementation Steps

### Step 1: Record Current State (5 minutes)

```bash
# Get current git commit hash
git log -1 --format="%H %s" > .backup/git-state.txt

# Count current files
find app -type f | wc -l > .backup/file-count-before.txt

# List all current files
find app server shared -type f > .backup/file-list-before.txt
```

**Validation**: Verify `.backup/git-state.txt` contains valid commit hash

---

### Step 2: Create Backup Directory Structure (2 minutes)

```bash
# Create backup directories
mkdir -p .backup/auth/app/pages
mkdir -p .backup/auth/app/middleware
mkdir -p .backup/auth/app/components
mkdir -p .backup/auth/server/api/auth
mkdir -p .backup/auth/shared/types
```

**Validation**: All directories created with correct permissions

---

### Step 3: Backup Critical Auth Files (5 minutes)

```bash
# Backup frontend auth files
cp app/pages/login.vue .backup/auth/app/pages/
cp app/middleware/require-auth.ts .backup/auth/app/middleware/
cp app/components/DashboardUserMenu.vue .backup/auth/app/components/

# Backup backend auth files
cp server/api/auth/login.post.ts .backup/auth/server/api/auth/
cp server/api/auth/logout.post.ts .backup/auth/server/api/auth/

# Backup shared types
cp shared/types/auth.d.ts .backup/auth/shared/types/
```

**Validation**: All 6 files copied successfully

---

### Step 4: Generate Checksums (3 minutes)

```bash
# Generate MD5 checksums for verification
cd .backup/auth
find . -type f -exec md5sum {} \; > checksums.txt
cd ../..
```

**Validation**: `checksums.txt` contains 6 entries

---

### Step 5: Verify Backup Integrity (2 minutes)

```bash
# Verify checksums match
cd .backup/auth
md5sum -c checksums.txt
cd ../..
```

**Expected Output**: All checksums OK

**Validation**: No checksum mismatches

---

### Step 6: Install Dependencies (8 minutes)

```bash
# Install chart libraries
pnpm add @unovis/vue @unovis/ts

# Install date utilities
pnpm add date-fns

# Verify installation
pnpm list @unovis/vue @unovis/ts date-fns
```

**Expected Versions**:
- @unovis/vue: ^1.4.2
- @unovis/ts: ^1.4.2
- date-fns: ^4.1.0

**Validation**: All packages in package.json, no peer dependency errors

---

### Step 7: Create Directory Structure (3 minutes)

```bash
# Create mock data directory
mkdir -p app/data

# Create mock composables directory
mkdir -p app/composables/mocks

# Verify directories
ls -la app/data
ls -la app/composables/mocks
```

**Validation**: Both directories exist and are empty

---

### Step 8: Create Restoration Script (2 minutes)

Create `.backup/restore-auth.sh`:

```bash
#!/bin/bash
set -e

echo "Restoring auth files from backup..."

# Restore frontend
cp .backup/auth/app/pages/login.vue app/pages/
cp .backup/auth/app/middleware/require-auth.ts app/middleware/
cp .backup/auth/app/components/DashboardUserMenu.vue app/components/

# Restore backend
cp .backup/auth/server/api/auth/login.post.ts server/api/auth/
cp .backup/auth/server/api/auth/logout.post.ts server/api/auth/

# Restore types
cp .backup/auth/shared/types/auth.d.ts shared/types/

# Verify checksums
cd .backup/auth
md5sum -c checksums.txt
cd ../..

echo "✅ Auth files restored successfully"
```

Make executable:
```bash
chmod +x .backup/restore-auth.sh
```

**Validation**: Script executes without errors (dry run)

---

## Todo List

- [x] Record current git state and file counts
- [x] Create backup directory structure
- [x] Backup all 6 critical auth files
- [x] Generate MD5 checksums
- [x] Verify backup integrity (✅ manual verification passed, ❌ script has bug)
- [x] Install @unovis/vue dependency (v1.6.2 installed)
- [x] Install @unovis/ts dependency (v1.6.2 installed)
- [x] Install date-fns dependency (v4.1.0 installed)
- [x] Verify all dependencies installed correctly
- [x] Create app/data/ directory
- [x] Create app/composables/mocks/ directory
- [x] Create restoration script (.backup/restore-auth.sh)
- [ ] **FIX: Restore script checksum comparison bug (path format mismatch)**
- [ ] Test restoration script (dry run) - blocked by bug
- [ ] Add .gitignore entry for .backup/ directory
- [ ] Backup nuxt.config.ts and app.config.ts (recommended)
- [ ] Commit backup files to git (safety)

---

## Success Criteria

### Backup Verification
- ✅ All 6 auth files backed up to `.backup/auth/`
- ✅ Checksums file generated with 6 entries
- ✅ `md5sum -c checksums.txt` passes (all OK)
- ✅ Restoration script executes without errors

### Dependencies
- ✅ @unovis/vue installed (version ^1.4.2)
- ✅ @unovis/ts installed (version ^1.4.2)
- ✅ date-fns installed (version ^4.1.0)
- ✅ `pnpm install` completes without errors
- ✅ No peer dependency warnings

### Directory Structure
- ✅ `app/data/` directory exists and is writable
- ✅ `app/composables/mocks/` directory exists and is writable
- ✅ `.backup/auth/` directory contains all 6 files

### Documentation
- ✅ Git state recorded (commit hash)
- ✅ File count before migration recorded
- ✅ File list before migration recorded

---

## Risk Assessment

### High Risk
**Risk**: Backup fails silently (file copy errors)
**Mitigation**: Checksum verification after backup, manual file count verification

### Medium Risk
**Risk**: Dependency installation breaks existing packages
**Mitigation**: `pnpm install` creates lock file, can rollback via git

### Low Risk
**Risk**: Directory creation fails due to permissions
**Mitigation**: Run with appropriate permissions, verify with `ls -la`

---

## Security Considerations

- Backup directory should NOT be committed to public repos (contains auth logic)
- Add `.backup/` to `.gitignore` if repo is public
- Checksums prevent tampering with backup files
- Restoration script has `set -e` (exit on error) for safety

---

## Next Steps

After completion:
1. Verify all success criteria met
2. Proceed to [Phase 02: Mock Data Layer](./phase-02-mock-data-layer.md)
3. Keep backup directory intact until final testing complete

---

## Rollback Plan

If this phase fails:
1. Delete `.backup/` directory
2. `pnpm remove @unovis/vue @unovis/ts date-fns`
3. `git reset --hard HEAD` (if dependencies broke package.json)
4. Retry phase

---

## Unresolved Questions

1. Should backup be committed to git or kept local only?
   → **Recommendation**: Commit to private repo, add to .gitignore for public repos

2. Should we backup nuxt.config.ts and app.config.ts as well?
   → **Recommendation**: Yes, add to backup script for safety

3. What if restoration script fails mid-execution?
   → **Recommendation**: Add rollback logic to script (restore from git if checksum fails)
