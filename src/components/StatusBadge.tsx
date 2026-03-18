export function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string,string> = {
    ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
    EXPIRING: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
    EXPIRED: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${cfg[status]||'bg-gray-100 text-gray-600'}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1 ${status==='ACTIVE'?'bg-green-500':status==='EXPIRING'?'bg-amber-500':'bg-red-500'}`}/>
      {status}
    </span>
  )
}
