# Frontend Health Dashboard

A fullstack monitoring tool for tracking frontend performance metrics across multiple modules. Built to simulate the kind of internal tooling a frontend team would use to detect performance regressions across feature areas.
 
**Tech Stack:** Next.js 14 · TypeScript · Neon PostgreSQL · Drizzle ORM · React Query · Recharts · shadcn/ui · Tailwind CSS · Vercel


## What it does

- Monitors 4 key metrics per module: bundle size, render time, Lighthouse score, CLS score
- Color-coded health status (healthy / warning / critical) based on configurable thresholds
- 30-day trend charts per module
- Side-by-side module comparison
- URL-driven filters (shareable links)
- Alerts configuration panel with CI simulation endpoint
- Add modules and metrics directly from the UI
- Dark mode

---

## Architecture decisions

### Why Next.js 14 App Router over Pages Router
App Router enables React Server Components, which I used for the dashboard and module detail pages. These pages are read-heavy with no client interactivity on initial load — fetching data in a server component means zero client JS for the data layer, faster TTFBs, and no loading spinners on first render. Client components are used only where interactivity is needed (charts, filters, modals).

### Why React Query over Redux for server state
This app has no complex shared client state — it fetches and displays server data. Redux would be over-engineering. React Query gives me caching, background refetching, and staleTime configuration with a fraction of the boilerplate. The 30-second refetch interval is visible in the Network tab — a deliberate decision to show the dashboard stays fresh without hammering the DB.

### Why Neon over SQLite or a JSON file
Neon is managed PostgreSQL — same engine used in production systems, hosted in the cloud so Vercel can connect to it without any infrastructure setup. SQLite would break on Vercel's serverless environment. JSON files don't support relational queries. Neon gave me a real DB with zero ops overhead.

### Why Drizzle ORM over Prisma
Drizzle is lightweight, has a smaller bundle size, and its query API is closer to raw SQL which makes the intent clearer. Prisma's generated client adds overhead that isn't justified for a project of this scope.

### URL-driven filters
Filters use Next.js `useSearchParams` and `router.push` to keep state in the URL. This means filter combinations are shareable — paste the URL and your colleague sees the same view. It also means the back button works correctly. This is how real internal tools should behave.

### Adding a new module requires zero code changes
Modules are stored in the database. Adding a new module — either via the UI or a direct DB insert — automatically appears on the dashboard with no code changes. The threshold system in `lib/constants.ts` applies universally.

## Folder structure
src/
app/
api/
modules/route.ts          ← GET all modules, POST new module, DELETE module
metrics/route.ts          ← POST metric (CI simulation endpoint)
metrics/[moduleId]/       ← GET metrics for a module
alerts/route.ts           ← GET/POST/DELETE alerts config
dashboard/
page.tsx                  ← Server component, main grid
loading.tsx               ← Skeleton UI
[moduleId]/page.tsx       ← Module detail with charts
compare/page.tsx          ← Side-by-side comparison
alerts/page.tsx           ← Alerts configuration
components/
ui/                         ← shadcn primitives + ThemeToggle
charts/                     ← MetricChart (Recharts wrapper)
metrics/                    ← MetricCard, AddModuleModal, AddMetricModal,
DeleteModuleButton, ExportButton, ErrorBoundary
hooks/
useMetrics.ts               ← React Query hook with 30s refetch
lib/
db.ts                       ← Neon + Drizzle connection
schema.ts                   ← modules and metrics table definitions
constants.ts                ← health thresholds, refresh interval
utils.ts                    ← getHealthStatus, getStatusColor, getStatusBg
types/
metrics.ts                  ← TypeScript interfaces

## Local setup

```bash
git clone https://github.com/tanu-rathore/frontend-health-dashboard
cd frontend-health-dashboard
npm install
```

Create `.env.local`:

DATABASE_URL=your_neon_connection_string
METRICS_API_KEY=your_api_key

```bash
npm run db:push    # push schema to Neon
npm run db:seed    # seed 12 modules + 360 days of metrics
npm run dev        # start dev server
```

## CI Integration

Push metrics from any CI pipeline:

```bash
curl -X POST https://your-domain.vercel.app/api/metrics \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "moduleId": "your-module-uuid",
    "bundleSizeKb": 245,
    "renderTimeMs": 120,
    "lighthouseScore": 92,
    "clsScore": 0.05
  }'
```

---

## What I'd do differently at production scale

- **Authentication:** Clerk or NextAuth.js with Google SSO — appropriate for an internal tool rather than a custom login form
- **Edge functions:** Move the metrics ingestion endpoint to an edge function for lower latency from CI runners globally
- **Caching headers:** Add `Cache-Control` headers on the modules API — the list rarely changes and could be cached at the CDN layer
- **Real CI webhooks:** Replace the manual POST endpoint with proper GitHub Actions / CircleCI webhook integration
- **Metric aggregation:** Store daily aggregates separately instead of querying raw rows for charts — better performance at scale
- **Alerting:** Connect the alerts config to a real notification system (Slack webhook, PagerDuty)
