import { db } from "@/lib/db";
import { modules, metrics } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import MetricCard from "@/components/metrics/MetricCard";
import DashboardFilters from "@/components/metrics/DashboardFilters";
import ThemeToggle from "@/components/ui/themeToggle";
import { Module, Metric } from "@/types/metrics";
import { getHealthStatus } from "@/lib/utils";
import { Suspense } from "react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; team?: string; status?: string }>;
}) {
  const { search, team, status } = await searchParams;

  const allModules = await db.select().from(modules);

  const modulesWithMetrics = await Promise.all(
    allModules.map(async (mod) => {
      const latestMetrics = await db
        .select()
        .from(metrics)
        .where(eq(metrics.moduleId, mod.id))
        .orderBy(desc(metrics.recordedAt))
        .limit(1);

      return {
        module: mod as Module,
        latestMetric: latestMetrics[0] as Metric,
      };
    }),
  );

  const filtered = modulesWithMetrics.filter(({ module, latestMetric }) => {
    if (!latestMetric) return false;

    const matchesSearch = search
      ? module.name.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesTeam = team ? module.team === team : true;

    const matchesStatus = status
      ? getHealthStatus(latestMetric) === status
      : true;

    return matchesSearch && matchesTeam && matchesStatus;
  });

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="flex gap-2">
        <ThemeToggle />
        <a
          href="/dashboard/alerts"
          className="text-sm border rounded-lg px-4 py-2 hover:bg-muted transition-colors"
        >
          Alerts →
        </a>
        <a
          href="/dashboard/compare"
          className="text-sm border rounded-lg px-4 py-2 hover:bg-muted transition-colors"
        >
          Compare Modules →
        </a>
      </div>

      <Suspense fallback={null}>
        <DashboardFilters />
      </Suspense>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No modules match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(({ module, latestMetric }) => (
            <MetricCard
              key={module.id}
              module={module}
              latestMetric={latestMetric}
            />
          ))}
        </div>
      )}
    </main>
  );
}
