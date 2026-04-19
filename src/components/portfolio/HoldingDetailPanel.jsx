function Row({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--border-color)] py-2 last:border-0">
      <span className="text-xs text-[var(--text-secondary)]">{label}</span>
      <span className={`text-sm ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}

function HoldingDetailPanel({ row }) {
  if (!row) return null
  const dayPnl = (row.current - row.avg) * row.quantity
  const dayPnlPct = ((row.current - row.avg) / row.avg) * 100

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-2xl font-bold">{row.asset}</p>
          <p className="text-xs text-[var(--text-secondary)]">Spot · Primary account</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg">${row.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          <p className={dayPnl >= 0 ? 'text-sm text-green-400' : 'text-sm text-red-400'}>
            Day P/L: {dayPnl >= 0 ? '+' : ''}${dayPnl.toFixed(2)} ({dayPnlPct >= 0 ? '+' : ''}
            {dayPnlPct.toFixed(2)}%)
          </p>
        </div>
      </div>
      <div className="rounded-xl border border-[var(--border-color)] bg-black/20 p-3">
        <Row label="Quantity" value={String(row.quantity)} mono />
        <Row label="Average cost" value={`$${row.avg.toLocaleString()}`} mono />
        <Row label="Last price" value={`$${row.current.toLocaleString()}`} mono />
        <Row label="Invested" value={`$${row.invested.toLocaleString()}`} mono />
        <Row label="Unrealized P/L" value={`$${row.pnl.toFixed(2)}`} mono />
      </div>
      <p className="text-[11px] text-[var(--text-secondary)]">
        This panel is mock data for UI demonstration. Connect your broker API in Settings to stream live positions.
      </p>
    </div>
  )
}

export default HoldingDetailPanel
