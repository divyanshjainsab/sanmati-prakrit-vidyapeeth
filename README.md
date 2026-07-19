# Sanmati Prakrit Vidyapeeth

A multi-tenant Next.js site platform backed by MongoDB (Mongoose) and Cloudinary.
Each **tenant** is a subdomain-hosted site with its own configuration (logo,
hero, navigation, video, gallery, preferences) and its own admin login. The
apex domain / localhost is served by a `default` tenant, so it also works as a
plain single-site app.

## Prerequisites

- Node.js >= 20
- A MongoDB instance (local or hosted, e.g. MongoDB Atlas)
- A Cloudinary account

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values:

| Variable                  | Description                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| `MONGODB_URI`             | MongoDB connection string                                                                       |
| `SESSION_SECRET`          | Long random string used to sign session tokens (HMAC)                                           |
| `NEXT_PUBLIC_ROOT_DOMAIN` | Root domain for subdomain→tenant resolution (e.g. `example.com`; `lvh.me` for local subdomains) |
| `CLOUDINARY_URL`          | `cloudinary://<api_key>:<api_secret>@<cloud_name>` — picked up implicitly by the Cloudinary SDK |

Admin credentials are **per-tenant** and stored (scrypt-hashed) in the database —
see "Multi-tenancy" below. There is no global admin env var.

## Getting started

```bash
npm install

# Seed the default tenant's site-config so the apex/localhost site renders.
npm run seed

# Create the default site's admin login (needed to sign in at /admin).
npm run provision-tenant -- --slug=main --name="Sanmati Prakrit Vidyapeeth" \
  --username=admin --password='a-strong-password'

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> `seed` creates only the default tenant's public config. Signing in at
> `/admin` requires a tenant login, so provision the `main` tenant too (above).

## Multi-tenancy

- **Resolution:** the tenant is derived from the request's subdomain
  (`acme.example.com` → tenant `acme`). Apex, `www`, reserved subdomains, and
  unknown hosts resolve to the `default` (`main`) tenant. See `src/lib/tenant.ts`.
- **Data isolation:** one shared database; every `Image` carries a `tenant`
  field and all gallery queries are scoped by it. Site config is one document
  per tenant (`SiteConfig._id === <tenant slug>`). Cloudinary uploads are
  namespaced per tenant (`gallery/<tenant>`, `siteconfig/<tenant>`).
- **Auth:** each tenant has its own admin username + scrypt-hashed password in
  the `Tenant` collection. Login mints a signed, tenant-scoped session cookie,
  so a cookie for one tenant can't be replayed against another.

### Provision a tenant

```bash
npm run provision-tenant -- \
  --slug=acme --name="Acme Jain Sangh" \
  --username=admin --password='a-strong-password'
```

This creates/updates the tenant's admin login and a default site config, so
`acme.<root-domain>` renders immediately. The tenant admin then customizes
everything (including the logo) at `/admin` on their own subdomain.

### Localization (Hindi default)

The UI and tenant content are localized, defaulting to **Hindi** until a tenant
picks another language in `/admin` (stored in `preferences.locale`). Locale
precedence is: visitor cookie override (the हिं / EN toggle in the navbar) →
tenant default → Hindi. UI strings live in `src/lib/messages/{hi,en}.ts`.

Tenant text content (site name, nav, hero, text sections, video) is
**auto-translated on save**: when a translation provider is configured, the
`/api/siteconfig` handler translates the content from the tenant's source
language into the other locales and stores the result under `preferences.i18n`;
the public site then overlays the right language per request. Translation is
pluggable (`src/lib/translate.ts`) with a no-op default, so the app runs with no
external dependency; set `TRANSLATION_PROVIDER=libretranslate` + `TRANSLATION_URL`
(any LibreTranslate-compatible endpoint) to turn it on.

### Super-admin (fleet management)

The `admin.<root-domain>` subdomain serves a platform super-admin panel to
manage every tenant: create tenants, reset a tenant's admin password, suspend /
reactivate a tenant (a suspended site shows "not available"), and delete a
tenant with its content. The super-admin is a single operator configured via
`SUPERADMIN_USERNAME` / `SUPERADMIN_PASSWORD`; a suspended-tenant check runs on
every render. The panel and its API are only reachable on the admin subdomain
(enforced in `src/middleware.ts` and re-checked in every handler).

Visit `http://admin.lvh.me:3000` (local) or `https://admin.<your-domain>` (prod).

**Hosts without an admin subdomain** (e.g. a `*.vercel.app` URL where you can't
add `admin.…`): set `SUPERADMIN_PATH_ACCESS=1` and the panel is served at
`/superadmin` on the primary host instead (still gated by the super-admin
login). It's read at build time (edge middleware), so set it before deploying.

### Local subdomain testing

Set `NEXT_PUBLIC_ROOT_DOMAIN=lvh.me` (which resolves `*.lvh.me` → 127.0.0.1) and
visit `http://acme.lvh.me:3000`. Chromium also resolves `acme.localhost`. The
super-admin panel is at `http://admin.lvh.me:3000`.

### Why seeding / provisioning is required

Every page reads its tenant's `SiteConfig` document. If a subdomain has no
config document, that site shows a "Site not available" page. `npm run seed`
creates the default tenant's config; `npm run provision-tenant` creates any
other tenant's login + config.

### Running with Docker Compose

```bash
docker compose up
```

This starts a local MongoDB container, waits for it to be healthy, seeds the
default tenant's config, and runs the dev server — no local Mongo install
required. You still need `CLOUDINARY_URL` and `SESSION_SECRET` in `.env`, and a
provisioned tenant login to sign in.

## Scripts

| Script                     | Description                                       |
| -------------------------- | ------------------------------------------------- |
| `npm run dev`              | Start the dev server                              |
| `npm run build`            | Production build                                  |
| `npm run start`            | Start the production server                       |
| `npm run lint`             | ESLint (fails on any warning)                     |
| `npm run typecheck`        | `tsc --noEmit` — no live DB required              |
| `npm run test`             | Run the Vitest test suite                         |
| `npm run test:coverage`    | Run tests with a V8 coverage report               |
| `npm run format`           | Format the repo with Prettier                     |
| `npm run format:check`     | Verify formatting (used in CI)                    |
| `npm run seed`             | Create the default tenant's `SiteConfig` document |
| `npm run provision-tenant` | Create/update a tenant's admin login + config     |

A Husky pre-commit hook runs `lint-staged` (ESLint + Prettier on staged files).
CI (`.github/workflows/ci.yml`) runs typecheck, lint, format check, and tests
with coverage — none of which require a database.

## Routes

All routes are scoped to the tenant resolved from the request's subdomain.

- `/` — public homepage (hero, text sections, video, gallery preview)
- `/gallery` — public photo gallery
- `/upload` — gated image upload (tenant admin session)
- `/admin` — full site configuration panel (tenant admin session)
