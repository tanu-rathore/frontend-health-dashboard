import { db } from "@/lib/db";
import { modules, metrics } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MetricChart from "@/components/metrics/metricChart";
import { Module, Metric, HealthStatus } from "@/types/metrics";
import { getHealthStatus, getStatusBg } from "@/lib/utils";
import ErrorBoundary from "@/components/metrics/ErrorBoundary";
import Link from "next/link";
import DeleteModuleButton from "@/components/metrics/DeleteModuleButton";
import AddMetricModal from "@/components/metrics/AddMetricModal";
import ExportButton from "@/components/metrics/ExportButton";

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;

  const moduleData = await db
    .select()
    .from(modules)
    .where(eq(modules.id, moduleId))
    .limit(1);

  if (!moduleData[0]) notFound();

  const latestMetrics = await db
    .select()
    .from(metrics)
    .where(eq(metrics.moduleId, moduleId))
    .orderBy(desc(metrics.recordedAt))
    .limit(1);

  const mod = moduleData[0] as Module;
  const latest = latestMetrics[0] as Metric | undefined;
  const status = latest ? getHealthStatus(latest) : ("healthy" as HealthStatus);

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{mod.name}</h1>
            <Badge className={`border ${getStatusBg(status)}`}>{status}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {latest && <ExportButton moduleId={mod.id} moduleName={mod.name} />}
            <DeleteModuleButton moduleId={mod.id} moduleName={mod.name} />
          </div>
        </div>
        <p className="text-muted-foreground mt-1">
          {mod.team} · {mod.description}
        </p>
      </div>

      {/* Latest metrics summary */}
      {latest ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Bundle Size", value: `${latest.bundleSizeKb} kb` },
            { label: "Render Time", value: `${latest.renderTimeMs} ms` },
            { label: "Lighthouse", value: latest.lighthouseScore },
            { label: "CLS Score", value: latest.clsScore },
          ].map((item) => (
            <Card key={item.label}>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-xl font-semibold mt-1">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mb-8 p-6 border rounded-lg text-center">
          <p className="text-muted-foreground text-sm mb-3">
            No metrics yet for this module.
          </p>
          <AddMetricModal module={mod} />
        </div>
      )}

      {/* 30-day charts */}
      {latest && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ErrorBoundary>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Bundle Size (kb)</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricChart
                  moduleId={moduleId}
                  metric="bundleSizeKb"
                  color="#6366f1"
                  label="30-day trend"
                />
              </CardContent>
            </Card>
          </ErrorBoundary>

          <ErrorBoundary>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Render Time (ms)</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricChart
                  moduleId={moduleId}
                  metric="renderTimeMs"
                  color="#f59e0b"
                  label="30-day trend"
                />
              </CardContent>
            </Card>
          </ErrorBoundary>

          <ErrorBoundary>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Lighthouse Score</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricChart
                  moduleId={moduleId}
                  metric="lighthouseScore"
                  color="#10b981"
                  label="30-day trend"
                />
              </CardContent>
            </Card>
          </ErrorBoundary>

          <ErrorBoundary>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">CLS Score</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricChart
                  moduleId={moduleId}
                  metric="clsScore"
                  color="#ef4444"
                  label="30-day trend"
                />
              </CardContent>
            </Card>
          </ErrorBoundary>
        </div>
      )}
    </main>
  );
}
