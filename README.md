# NuxtHub Nuxt UI Admin Dashboard Template

Modern, production-ready admin dashboard template built on **Nuxt 4**, **NuxtHub**, and **Nuxt UI**. Features SSR, authentication, database operations, and optimistic UI patterns with zero-config Cloudflare deployment.

[![Deploy with NuxtHub](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fatinux%2Fatidone%2Ftree%2Fnuxthub-v1&env=NUXT_OAUTH_GITHUB_CLIENT_ID,NUXT_OAUTH_GITHUB_CLIENT_SECRET,NUXT_SESSION_PASSWORD&envDescription=GitHub%20OAuth%20App%20client%20ID%20and%20secret.%20Generate%20a%20random%20session%20password%20min%2032%20chars%20using%20%60openssl%20rand%20-hex%2032%60.&project-name=todos&repository-name=todos&demo-title=Atidone&demo-description=A%20demonstration%20using%20Nuxt%20with%20server-side%20rendering%2C%20authentication%20and%20database%20querying%20using%20Turso%20with%20Drizzle%20ORM&demo-url=https%3A%2F%2Ftodos.nuxt.dev%2F&demo-image=https%3A%2F%2Ftodos.nuxt.dev%2Fsocial-image.png&products=%255B%257B%2522type%2522%253A%2522integration%2522%252C%2522protocol%2522%253A%2522storage%2522%252C%2522productSlug%2522%253A%2522database%2522%252C%2522integrationSlug%2522%253A%2522tursocloud%2522%257D%255D)

## ✨ Features

### Authentication & Security
- 🔐 Email/password authentication using [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils)
- 🛡️ Encrypted session cookies with CSRF protection
- 🔒 Route-level protection middleware
- 🔑 Secure password hashing

### Database & ORM
- 💾 [Turso](https://turso.tech) (SQLite/LibSQL) via [NuxtHub DB](https://hub.nuxt.com/docs/storage/database)
- 🗄️ [Drizzle ORM](https://orm.drizzle.team/) with TypeScript support
- 🔄 [Automatic migrations](https://hub.nuxt.com/docs/features/database#database-migrations) (dev + production)
- 🎨 [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview/) in [Nuxt DevTools](https://devtools.nuxt.com)

### UI & UX
- 🎯 [Nuxt UI v4](https://ui.nuxt.com) component library
- 📱 Responsive dashboard layout
- ⌨️ Keyboard shortcuts (g-h: home, n: notifications)
- 🎪 Slide-over panels and modals
- 🎨 Customizable theme (Tailwind)

### State Management
- 📦 [Pinia](https://pinia.vuejs.org/) for global state
- 🚀 [Pinia Colada](https://pinia-colada.esm.dev) for server state & caching
- ⚡ Optimistic UI updates

## 📚 Documentation

- [Project Overview & PDR](./docs/project-overview-pdr.md)
- [Codebase Summary](./docs/codebase-summary.md)
- [Code Standards](./docs/code-standards.md)
- [System Architecture](./docs/system-architecture.md)

## 🏗️ Architecture Overview

```
Frontend (Nuxt 4 + Vue 3)
├── Nuxt UI Components
├── Pinia + Pinia Colada (State)
└── SSR + CSR Rendering

Backend (Nitro Server)
├── File-based API Routes
├── Drizzle ORM
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
├── components/         # Vue components
├── composables/        # Shared composables
├── layouts/            # Layout components
├── pages/              # File-based routes
└── middleware/         # Route middleware

server/                 # Backend (Nitro)
├── api/                # API endpoints
│   ├── auth/           # Login/logout
│   └── todos/          # CRUD operations
├── db/                 # Database schema
│   ├── schema.ts       # Drizzle schema
│   └── migrations/     # Migration files
└── tasks/              # Background tasks

shared/                 # Shared types
└── types/              # TypeScript definitions

docs/                   # Documentation
plans/                  # Planning & reports
public/                 # Static assets
```

## 🎬 Live Demo

https://todos.nuxt.dev

> For Passkeys (WebAuthn) example, see [todo-passkeys](https://github.com/atinux/todo-passkeys)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or 20+
- pnpm 8+ (recommended) or npm

### Installation

1. **Install dependencies**:
```bash
pnpm install
```

2. **Configure environment variables**:

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Generate a session password (min 32 characters):
```bash
openssl rand -hex 32
```

Update `.env`:
```bash
NUXT_SESSION_PASSWORD="your-generated-session-password"
```

> **Note**: GitHub OAuth is optional. Template uses email/password auth by default.

3. **Seed the database**:
```bash
npx nitro task db:seed
```

Default admin user:
- Email: `admin@local.dev`
- Password: `!password!`

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
| **State** | Pinia 3.0.4 + Pinia Colada 0.18.0 |
| **Validation** | Zod 4.1.13 |
| **Deployment** | NuxtHub (Cloudflare) |
| **Package Manager** | pnpm 10.24.0 |

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
- [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM
- [Turso](https://turso.tech) - SQLite for Production

---

**Built with ❤️ using Nuxt 4 + NuxtHub + Nuxt UI**
