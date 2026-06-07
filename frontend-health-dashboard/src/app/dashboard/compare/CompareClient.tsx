"use client";

import { useState } from "react";
import { useMetrics } from "@/hooks/useMetrics";
import { Module } from "@/types/metrics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MetricChart from "@/components/metrics/metricChart";
import { getHealthStatus, getStatusBg } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CompareClientProps {
  modules: Module[];
}

function ModuleColumn({ module }: { module: Module }) {
  const { data, isLoading } = useMetrics(module.id);
  const latest = data?.[0];
  const status = latest ? getHealthStatus(latest) : null;

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-lg font-semibold">{module.name}</h2>
        {status && (
          <Badge className={`border text-xs ${getStatusBg(status)}`}>
            {status}
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {module.team} · {module.description}
      </p>

      {/* Latest metrics */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-2 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : latest ? (
        <div className="grid grid-cols-2 gap-2 mb-6">
          {[
            { label: "Bundle Size", value: `${latest.bundleSizeKb} kb` },
            { label: "Render Time", value: `${latest.renderTimeMs} ms` },
            { label: "Lighthouse", value: latest.lighthouseScore },
            { label: "CLS Score", value: latest.clsScore },
          ].map((item) => (
            <Card key={item.label}>
              <CardContent className="pt-3 pb-3">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-base font-semibold mt-1">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground mb-6 p-4 border rounded-lg text-center">
          No metrics available
        </div>
      )}

      {/* Charts */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Bundle Size (kb)</CardTitle>
          </CardHeader>
          <CardContent>
            <MetricChart
              moduleId={module.id}
              metric="bundleSizeKb"
              color="#6366f1"
              label="30-day trend"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Render Time (ms)</CardTitle>
          </CardHeader>
          <CardContent>
            <MetricChart
              moduleId={module.id}
              metric="renderTimeMs"
              color="#f59e0b"
              label="30-day trend"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Lighthouse Score</CardTitle>
          </CardHeader>
          <CardContent>
            <MetricChart
              moduleId={module.id}
              metric="lighthouseScore"
              color="#10b981"
              label="30-day trend"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">CLS Score</CardTitle>
          </CardHeader>
          <CardContent>
            <MetricChart
              moduleId={module.id}
              metric="clsScore"
              color="#ef4444"
              label="30-day trend"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CompareClient({ modules }: CompareClientProps) {
  const [moduleA, setModuleA] = useState<Module | null>(null);
  const [moduleB, setModuleB] = useState<Module | null>(null);

  return (
    <div>
      {/* Module selectors */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-center">
        <Select
          onValueChange={(id) =>
            setModuleA(modules.find((m) => m.id === id) ?? null)
          }
        >
          <SelectTrigger className="sm:w-64">
            <SelectValue placeholder="Select first module" />
          </SelectTrigger>
          <SelectContent>
            {modules.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-muted-foreground font-semibold text-sm px-2">
          vs
        </div>

        <Select
          onValueChange={(id) =>
            setModuleB(modules.find((m) => m.id === id) ?? null)
          }
        >
          <SelectTrigger className="sm:w-64">
            <SelectValue placeholder="Select second module" />
          </SelectTrigger>
          <SelectContent>
            {modules.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Comparison columns */}
      {moduleA || moduleB ? (
        <div className="flex flex-col md:flex-row gap-8">
          {moduleA ? (
            <ModuleColumn module={moduleA} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm border rounded-lg p-8">
              Select a module
            </div>
          )}
          <div className="w-px bg-border hidden md:block" />
          {moduleB ? (
            <ModuleColumn module={moduleB} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm border rounded-lg p-8">
              Select a module
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-4xl mb-4">⚡</p>
          <p className="text-sm">
            Select two modules above to compare their metrics
          </p>
        </div>
      )}
    </div>
  );
}