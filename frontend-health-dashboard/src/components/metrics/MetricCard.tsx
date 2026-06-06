"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Module, Metric, HealthStatus } from "@/types/metrics";
import { getHealthStatus, getStatusBg } from "@/lib/utils";
import Link from "next/link";
import AddMetricModal from "@/components/metrics/AddMetricModal";

interface MetricCardProps {
  module: Module;
  latestMetric: Metric | undefined;
}

export default function MetricCard({ module, latestMetric }: MetricCardProps) {
  const status = latestMetric ? getHealthStatus(latestMetric) : "healthy" as HealthStatus;

  return (
    <Link href={`/dashboard/${module.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold">{module.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{module.team}</p>
          </div>
          <Badge className={`text-xs border ${getStatusBg(status)}`}>
            {status}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">{module.description}</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/50 rounded p-2">
              <p className="text-xs text-muted-foreground">Bundle Size</p>
              <p className="text-sm font-medium">{latestMetric ? `${latestMetric.bundleSizeKb} kb` : "—"}</p>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <p className="text-xs text-muted-foreground">Render Time</p>
              <p className="text-sm font-medium">{latestMetric ? `${latestMetric.renderTimeMs} ms` : "—"}</p>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <p className="text-xs text-muted-foreground">Lighthouse</p>
              <p className="text-sm font-medium">{latestMetric ? latestMetric.lighthouseScore : "—"}</p>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <p className="text-xs text-muted-foreground">CLS Score</p>
              <p className="text-sm font-medium">{latestMetric ? latestMetric.clsScore : "—"}</p>
            </div>
          </div>
         {!latestMetric && (
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <AddMetricModal module={module} />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}