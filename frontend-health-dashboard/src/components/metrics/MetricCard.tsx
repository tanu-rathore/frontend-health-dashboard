"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Module, Metric, HealthStatus } from "@/types/metrics";
import { getHealthStatus, getStatusBg } from "@/lib/utils";
import Link from "next/link";
import AddMetricModal from "@/components/metrics/AddMetricModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricCardProps {
  module: Module;
  latestMetric: Metric | undefined;
}

export default function MetricCard({ module, latestMetric }: MetricCardProps) {
  const status = latestMetric
    ? getHealthStatus(latestMetric)
    : ("healthy" as HealthStatus);

  return (
    <Link href={`/dashboard/${module.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50 h-full">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold truncate">
              {module.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {module.team}
            </p>
          </div>
          <div className="flex items-center gap-1.5 ml-2 shrink-0">
            <Badge className={`text-xs border ${getStatusBg(status)}`}>
              {status}
            </Badge>
            {!latestMetric && (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <AddMetricModal module={module} iconOnly />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add metrics</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3 truncate">
            {module.description}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/50 rounded p-2">
              <p className="text-xs text-muted-foreground">Bundle Size</p>
              <p className="text-sm font-medium">
                {latestMetric ? `${latestMetric.bundleSizeKb} kb` : "—"}
              </p>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <p className="text-xs text-muted-foreground">Render Time</p>
              <p className="text-sm font-medium">
                {latestMetric ? `${latestMetric.renderTimeMs} ms` : "—"}
              </p>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <p className="text-xs text-muted-foreground">Lighthouse</p>
              <p className="text-sm font-medium">
                {latestMetric ? latestMetric.lighthouseScore : "—"}
              </p>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <p className="text-xs text-muted-foreground">CLS Score</p>
              <p className="text-sm font-medium">
                {latestMetric ? latestMetric.clsScore : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
