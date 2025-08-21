export function Row({ label, value, allowHtml }: { label: string; value?: string | null; allowHtml?: boolean }) {
    const content = value && value.trim().length > 0 ? value : 'Not set'
    return (
      <div className="grid gap-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        {allowHtml ? (
          <span className="text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <span className="text-sm leading-relaxed whitespace-pre-wrap">{content}</span>
        )}
      </div>
    )
  }