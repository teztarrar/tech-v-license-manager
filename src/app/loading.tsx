import { SkeletonCard, SkeletonChart } from '@/components/ui'

export default function Loading() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><SkeletonChart /></div>
        <SkeletonChart />
      </div>
    </div>
  )
}

