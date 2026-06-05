import { useQuery } from "@tanstack/react-query";
import { Metric } from "@/types/metrics";

export function useMetrics(moduleId: string) {
  return useQuery<Metric[]>({
    queryKey: ["metrics", moduleId],
    queryFn: async () => {
      const res = await fetch(`/api/metrics/${moduleId}`);
      if (!res.ok) throw new Error("Failed to fetch metrics");
      return res.json();
    },
    refetchInterval: 30_000, // auto-refresh every 30s
  });
}