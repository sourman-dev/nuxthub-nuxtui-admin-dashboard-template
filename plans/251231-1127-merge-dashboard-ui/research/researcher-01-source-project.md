# Researcher Report: Source Project Analysis (nuxt-ui-dashboard)

## Directory Structure & File Counts (app/)
- **Total Files**: ~25+
- **app/components/**: 14 files (Organized by domain: customers, home, inbox, settings + shared)
- **app/pages/**: 8 files (Index, customers, inbox, settings [nested])
- **app/layouts/**: 1 file (default.vue)
- **app/composables/**: 1 file (useDashboard.ts)
- **app/types/**: 1 file (index.d.ts)
- **app/utils/**: 1 file (index.ts)
- **app/assets/**: CSS (main.css)

## Components (`app/components/`)
### Layout/UI (Shared)
- `TeamsMenu.vue`
- `UserMenu.vue`
- `NotificationsSlideover.vue`
### Home
- `HomeDateRangePicker.vue`, `HomeSales.vue`, `HomeChart.client.vue`, `HomeChart.server.vue`, `HomeStats.vue`, `HomePeriodSelect.vue`
### Inbox
- `InboxMail.vue`, `InboxList.vue`
### Customers
- `DeleteModal.vue`, `AddModal.vue`
### Settings
- `MembersList.vue`

## Pages (`app/pages/`)
- `index.vue`: Main dashboard (Charts/Stats)
- `customers.vue`: Customer management table
- `inbox.vue`: Mail/Inbox interface
- `settings.vue`: Settings layout wrapper
- `settings/index.vue`: General settings
- `settings/members.vue`: Team members
- `settings/notifications.vue`: Notification settings
- `settings/security.vue`: Security settings
*Note: No `login.vue` found in source app/pages/.*

## Layouts (`app/layouts/`)
- `default.vue`: Main dashboard shell (Sidebar, Navbar, Slideover integration).

## Composables (`app/composables/`)
- `useDashboard.ts`: Manages global dashboard state (notifications open) and keyboard shortcuts.

## Data & API Usage
The following endpoints are called via `useFetch`:
- `/api/notifications`: `Notification[]`
- `/api/members`: `Member[]`
- `/api/mails`: `Mail[]`
- `/api/customers`: `User[]`

## Types (`app/types/index.d.ts`)
- `User`, `UserStatus`, `Mail`, `Member`, `Stat`, `Sale`, `SaleStatus`, `Notification`, `Period`, `Range`.

## Key Dependencies (package.json)
- `@nuxt/ui`: ^4.3.0
- `@unovis/vue`, `@unovis/ts`: For charts.
- `@vueuse/nuxt`: ^14.1.0
- `date-fns`: ^4.1.0

## Merging & Conflict Analysis
- **Conflicts**:
  - `app/app.vue`: Target project already has logic (Auth/Hub). Need to merge UI shell.
  - `app/layouts/default.vue`: Target has a default layout. Dashboard layout should likely be renamed or merge into it.
  - `app/pages/index.vue`: Target has a simple index. Will be replaced by dashboard.
  - `nuxt.config.ts`: Need to merge `@unovis/vue` and other dependencies.
- **Migration Need**: Server APIs in source project are likely mock files. Target project needs actual NuxtHub/D1 implementations or updated mocks.
