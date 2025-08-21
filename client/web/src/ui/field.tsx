
export function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="grid gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm leading-relaxed whitespace-pre-wrap">{value}</span>
    </div>
  )
}