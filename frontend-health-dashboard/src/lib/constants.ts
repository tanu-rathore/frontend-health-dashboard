import { MetricThreshold } from "@/types/metrics";

export const METRIC_THRESHOLDS: MetricThreshold = {
  bundleSizeKb:    { warning: 300,  critical: 500  },
  renderTimeMs:    { warning: 200,  critical: 500  },
  lighthouseScore: { warning: 80,   critical: 60   },
  clsScore:        { warning: 0.1,  critical: 0.25 },
};

export const REFRESH_INTERVAL_MS = 30_000;

export const DATE_RANGES = [
  { label: "7 days",  value: "7d"  },
  { label: "14 days", value: "14d" },
  { label: "30 days", value: "30d" },
];