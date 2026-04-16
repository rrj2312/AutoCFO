export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-[#1F2937] rounded-lg animate-pulse ${className}`}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="flex justify-center py-4">
        <Skeleton className="h-44 w-44 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-20 rounded-2xl" />
      <div className="space-y-3">
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
      </div>
    </div>
  );
}

export function RisksSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-40" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2 bg-[#111827] rounded-2xl p-4 border border-[#1F2937]">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
