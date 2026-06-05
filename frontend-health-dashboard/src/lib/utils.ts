import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { HealthStatus, Metric } from "@/types/metrics";
import { METRIC_THRESHOLDS } from "./constants";

export function getHealthStatus(metric: Metric): HealthStatus {
  const t = METRIC_THRESHOLDS;

  if (
    metric.bundleSizeKb > t.bundleSizeKb.critical ||
    metric.renderTimeMs > t.renderTimeMs.critical ||
    metric.lighthouseScore < t.lighthouseScore.critical ||
    metric.clsScore > t.clsScore.critical
  ) {
    return "critical";
  }

  if (
    metric.bundleSizeKb > t.bundleSizeKb.warning ||
    metric.renderTimeMs > t.renderTimeMs.warning ||
    metric.lighthouseScore < t.lighthouseScore.warning ||
    metric.clsScore > t.clsScore.warning
  ) {
    return "warning";
  }

  return "healthy";
}

export function getStatusColor(status: HealthStatus) {
  return {
    healthy: "text-green-500",
    warning: "text-yellow-500",
    critical: "text-red-500",
  }[status];
}

export function getStatusBg(status: HealthStatus) {
  return {
    healthy: "bg-green-500/10 text-green-600 border-green-200",
    warning: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
    critical: "bg-red-500/10 text-red-600 border-red-200",
  }[status];
}
