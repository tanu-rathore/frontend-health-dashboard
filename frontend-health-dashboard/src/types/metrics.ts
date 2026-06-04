export type HealthStatus = "healthy" | "warning" | "critical";

export interface Module {
  id: string;
  name: string;
  description: string;
  team: string;
  createdAt: Date;
}

export interface Metric {
  id: string;
  moduleId: string;
  bundleSizeKb: number;
  renderTimeMs: number;
  lighthouseScore: number;
  clsScore: number;
  recordedAt: Date;
}

export interface MetricSnapshot {
  module: Module;
  latest: Metric;
  history: Metric[];
  status: HealthStatus;
}

export interface MetricThreshold {
  bundleSizeKb: { warning: number; critical: number };
  renderTimeMs: { warning: number; critical: number };
  lighthouseScore: { warning: number; critical: number };
  clsScore: { warning: number; critical: number };
}