import { db } from "@/lib/db";
import { modules, metrics } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import MetricCard from "@/components/metrics/MetricCard";
import { Module, Metric } from "@/types/metrics";

export default async function DashboardPage() {
  // Server component — data fetched at request time, no client JS needed
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
    })
  );

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Frontend Health Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Monitoring {allModules.length} modules across all teams
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {modulesWithMetrics.map(({ module, latestMetric }) =>
          latestMetric ? (
            <MetricCard
              key={module.id}
              module={module}
              latestMetric={latestMetric}
            />
          ) : null
        )}
      </div>
    </main>
  );
}