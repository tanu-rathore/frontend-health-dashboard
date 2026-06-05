"use client";

import { useMetrics } from "@/hooks/useMetrics";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricChartProps {
  moduleId: string;
  metric: "bundleSizeKb" | "renderTimeMs" | "lighthouseScore" | "clsScore";
  color: string;
  label: string;
}

export default function MetricChart({
  moduleId,
  metric,
  color,
  label,
}: MetricChartProps) {
  const { data, isLoading, isError } = useMetrics(moduleId);

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  if (isError || !data) {
    return (
      <div className="h-[200px] w-full flex items-center justify-center text-sm text-muted-foreground">
        Failed to load chart
      </div>
    );
  }

  const chartData = data
    .slice(0, 30)
    .reverse()
    .map((m) => ({
      date: new Date(m.recordedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: m[metric],
    }));

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 10 }} width={40} />
          <Tooltip
            contentStyle={{ fontSize: 12 }}
            labelStyle={{ fontSize: 11 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}