# NuxtHub Nuxt UI Admin Dashboard Template

Modern, production-ready admin dashboard template built on **Nuxt 4**, **NuxtHub**, and **Nuxt UI**. Features complete dashboard UI, authentication, database operations, and zero-config Cloudflare deployment.

[![Deploy with NuxtHub](https://hub.nuxt.com/button.svg)](https://hub.nuxt.com/new)

## ✨ Features

### Dashboard UI
- 📊 **Dashboard Page** - Charts, stats, sales analytics
- 👥 **Customers Page** - Data table with search, filters, pagination
- 📧 **Inbox Page** - Mail list with detail view
- ⚙️ **Settings Pages** - Members, notifications, preferences
- 🎨 **16 UI Components** - Modals, slideouts, menus, charts
- ⌨️ **Keyboard Shortcuts** - `g-h` (home), `g-c` (customers), `g-i` (inbox), `g-s` (settings), `n` (notifications)
- 📱 **Responsive Design** - Mobile, tablet, desktop layouts

### Authentication & Security
- 🔐 Email/password authentication using [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils)
- 🛡️ Encrypted session cookies with CSRF protection
- 🔒 Route-level protection middleware
- 🔑 Secure password hashing with bcrypt + salt
- 🆔 UUID primary keys for enhanced security

### Database & ORM
- 💾 [Turso](https://turso.tech) (SQLite/LibSQL) via [NuxtHub DB](https://hub.nuxt.com/docs/storage/database)
- 🗄️ [Drizzle ORM](https://orm.drizzle.team/) with TypeScript support
- 🔄 [Automatic migrations](https://hub.nuxt.com/docs/features/database#database-migrations) (dev + production)
- 🎨 [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview/) in [Nuxt DevTools](https://devtools.nuxt.com)

### Mock Data Layer
- 📋 **5 Mock Composables** - Notifications, members, mails, customers, sales
- 🔄 **Loading & Error States** - Built-in state management
- 🔍 **Search & Filter** - Client-side data operations
- 📄 **Pagination** - Configurable page sizes

### UI & UX
- 🎯 [Nuxt UI v4](https://ui.nuxt.com) component library
- 📱 Responsive dashboard layout with collapsible sidebar
- 🎪 Slide-over panels and modals
- 🎨 Customizable theme (Tailwind CSS)

## 🏗️ Architecture Overview

```
Frontend (Nuxt 4 + Vue 3)
├── Nuxt UI Components
├── Dashboard Layout
├── Mock Data Composables
└── SSR + CSR Rendering

Backend (Nitro Server)
├── File-based API Routes
├── Drizzle ORM
├── Password Utilities
└── nuxt-auth-utils (Sessions)

Database (SQLite/LibSQL)
└── NuxtHub Managed

Deployment (Cloudflare)
├── Workers (Server)
├── Pages (Static Assets)
└── D1/KV (Database)
```

## 📁 Directory Structure

```
app/                    # Frontend application
├── components/         # Dashboard UI components
│   ├── Dashboard*.vue  # Charts, stats, menus
│   ├── Customers*.vue  # Customer modals
│   ├── Inbox*.vue      # Mail components
│   ├── Settings*.vue   # Settings modals
│   └── Notifications*  # Notification components
├── composables/        # Shared composables
│   ├── mocks/          # Mock data composables
│   └── useDashboard.ts # Dashboard state
├── layouts/            # Layout components
│   └── dashboard.vue   # Main dashboard layout
├── pages/              # File-based routes
│   ├── index.vue       # Dashboard home
│   ├── customers.vue   # Customers management
│   ├── inbox.vue       # Mail inbox
│   ├── login.vue       # Login page
│   └── settings/       # Settings pages
├── middleware/         # Route middleware
│   └── require-auth.ts # Auth protection
├── data/               # Mock JSON data
└── types/              # TypeScript definitions

server/                 # Backend (Nitro)
├── api/                # API endpoints
│   └── auth/           # Login/logout
├── db/                 # Database schema
│   ├── schema.ts       # Drizzle schema (users)
│   └── migrations/     # Migration files
├── utils/              # Server utilities
│   └── password.ts     # Password hashing
└── tasks/              # Background tasks
    └── seed.ts         # Database seeding

public/                 # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or 20+
- pnpm 8+ (recommended) or npm

### Installation

1. **Use this template**:
   - Click "Use this template" button on GitHub
   - Or clone: `git clone https://github.com/sourman-dev/nuxthub-nuxtui-admin-dashboard-template.git`

2. **Install dependencies**:
```bash
pnpm install
```

3. **Configure environment variables**:

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Generate a session password and password salt:
```bash
# Session password (min 32 characters)
openssl rand -hex 32

# Password salt (min 16 characters)
openssl rand -hex 16
```

Update `.env`:
```bash
NUXT_SESSION_PASSWORD="your-generated-session-password"
NUXT_PASSWORD_SALT="your-generated-password-salt"
```

4. **Seed the database**:
```bash
pnpm dev
# In another terminal:
npx nitro task db:seed
```

Default admin user:
- Email: `admin@local.dev`
- Password: `!password!`

5. **Access the dashboard**:
   - Open http://localhost:3000
   - Login with admin credentials
   - Explore dashboard, customers, inbox, settings pages

## 💻 Development

Start the dev server on http://localhost:3000:

```bash
pnpm dev
```

### Available Scripts

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm typecheck        # Type check with vue-tsc
pnpm db:generate      # Generate Drizzle migrations
npx nitro task db:seed # Seed database
```

### Development Tools

**Nuxt DevTools** (built-in):
- 🗄️ Database viewer (Hub Database tab)
- 🎨 Drizzle Studio (visual schema editor)
- 📊 Performance metrics
- 🔍 Component inspector

Access DevTools by clicking the Nuxt icon in bottom-right of browser.

### Development Workflow

1. **Make changes** to code (auto-reload via HMR)
2. **View database** in Drizzle Studio (DevTools)
3. **Generate migrations** when schema changes:
   ```bash
   pnpm db:generate
   ```
4. **Test locally** before deployment

## 🎨 Customization

### Adding New Pages

1. Create page in `app/pages/`:
```vue
<!-- app/pages/my-page.vue -->
<script setup lang="ts">
definePageMeta({
  middleware: 'require-auth',
  layout: 'dashboard'
})
</script>

<template>
  <div>Your content</div>
</template>
```

2. Add navigation in `app/layouts/dashboard.vue`:
```typescript
links: [
  { label: 'My Page', to: '/my-page', icon: 'i-lucide-file' }
]
```

### Creating Mock Data

1. Add JSON data in `app/data/`:
```json
// app/data/my-data.json
[
  { "id": 1, "name": "Item 1" }
]
```

2. Create composable in `app/composables/mocks/`:
```typescript
// app/composables/mocks/useMockMyData.ts
export function useMockMyData() {
  const data = ref<MyData[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchData() {
    loading.value = true
    try {
      const response = await fetch('/data/my-data.json')
      data.value = await response.json()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchData }
}
```

### Database Schema Changes

1. Update `server/db/schema.ts`
2. Generate migration: `pnpm db:generate`
3. Migration auto-applies on next dev server start

## 🚢 Deployment

### NuxtHub (Cloudflare)

Deploy to Cloudflare with zero configuration:

```bash
npx nuxthub deploy
```

**What happens**:
1. Builds Nitro server + static assets
2. Runs database migrations automatically
3. Deploys to Cloudflare Workers + Pages
4. Sets up managed database (Turso/LibSQL)

**First deployment**:
- Create NuxtHub account at https://hub.nuxt.com
- Link GitHub repository
- Add environment variables in dashboard
- Deploy via CLI or GitHub Actions

### GitHub Actions CI/CD

Configure `.github/workflows/deploy.yml` for automatic deployments on push to `main`.

See: https://hub.nuxt.com/docs/getting-started/deploy

### Remote Database Access

Connect to production database locally:

```bash
pnpm dev --remote
```

Useful for:
- Testing with production data
- Running migrations against production
- Debugging production issues

Learn more: https://hub.nuxt.com/docs/getting-started/remote-storage

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Nuxt 4.2.1 |
| **UI Library** | Nuxt UI 4.2.1 |
| **Database** | SQLite/LibSQL (Turso) |
| **ORM** | Drizzle 0.44.7 |
| **Auth** | nuxt-auth-utils 0.5.25 |
| **Validation** | Zod 4.1.13 |
| **Deployment** | NuxtHub (Cloudflare) |
| **Package Manager** | pnpm 10.24.0 |

## 📦 What's Included

### Pages
- ✅ Dashboard (/) - Charts, stats, sales
- ✅ Customers (/customers) - Table, filters, modals
- ✅ Inbox (/inbox) - Mail list, detail view
- ✅ Settings (/settings) - 4 sub-pages
- ✅ Login (/login) - Email/password authentication

### Components (16)
- ✅ Dashboard: Charts, Stats, DateRangePicker, Sales, User/Teams menus
- ✅ Customers: Add/Delete modals
- ✅ Inbox: List, Mail detail
- ✅ Settings: Members management (4 modals)
- ✅ Shared: Notifications slideover

### Mock Data (5 composables)
- ✅ Notifications (5 items)
- ✅ Members (10 members)
- ✅ Mails (15 emails)
- ✅ Customers (55 customers)
- ✅ Sales (90 days)

## 🎯 Roadmap

- [ ] Real-time notifications
- [ ] Dark mode support
- [ ] Email templates
- [ ] File upload handling
- [ ] Advanced filtering
- [ ] Data export (CSV, PDF)
- [ ] Multi-language support (i18n)
- [ ] Role-based access control (RBAC)

## 🤝 Contributing

Contributions welcome! Please read contributing guidelines first.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

[MIT License](./LICENSE)

## 🙏 Acknowledgments

- [Nuxt](https://nuxt.com) - The Intuitive Vue Framework
- [NuxtHub](https://hub.nuxt.com) - Deploy Nuxt on Cloudflare
- [Nuxt UI](https://ui.nuxt.com) - Beautiful UI components
- [Nuxt UI Dashboard](https://github.com/nuxt-ui-pro/dashboard) - Dashboard inspiration
- [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM
- [Turso](https://turso.tech) - SQLite for Production

---

**Built with ❤️ using Nuxt 4 + NuxtHub + Nuxt UI**
