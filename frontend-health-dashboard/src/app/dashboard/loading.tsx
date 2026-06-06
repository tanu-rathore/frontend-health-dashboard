import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-9 w-44" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-full" />
            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-12 w-full rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}