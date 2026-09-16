export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} style={{ minHeight: '1rem' }} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
