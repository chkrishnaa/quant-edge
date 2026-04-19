import { ExternalLink } from 'lucide-react'
import { enrichMarketAsset } from '../../services/marketService.js'
import TradingViewWidget from '../charts/TradingViewWidget.jsx'

function Stat({ label, value, valueClass }) {
  return (
    <div className="rounded-lg border border-[var(--border-color)] bg-black/20 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-[var(--text-secondary)]">{label}</p>
      <p className={`mt-1 font-mono text-sm ${valueClass || 'text-[var(--text-primary)]'}`}>{value}</p>
    </div>
  )
}

function AssetDetailPanel({ asset }) {
  if (!asset) return null
  const d = enrichMarketAsset(asset)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-bold tracking-tight">{d.symbol}</p>
          <p className="text-sm text-[var(--text-secondary)]">Binance · Perp · USDT</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xl">${d.price.toLocaleString()}</p>
          <p className={d.changePercent >= 0 ? 'text-sm text-green-400' : 'text-sm text-red-400'}>
            {d.changePercent >= 0 ? '+' : ''}
            {d.changePercent.toFixed(2)}% (24h)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat label="24h High" value={`$${d.high24h.toLocaleString()}`} />
        <Stat label="24h Low" value={`$${d.low24h.toLocaleString()}`} />
        <Stat label="24h Open" value={`$${d.open24h.toLocaleString()}`} />
        <Stat label="Quote Vol" value={`$${(d.quoteVolume / 1e6).toFixed(2)}M`} />
        <Stat label="Base Vol" value={d.baseVolume.toLocaleString()} />
        <Stat label="Est. Spread" value={`${d.spreadBps} bps`} />
      </div>

      <a
        href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(d.tradingViewSymbol)}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:underline"
      >
        Open in TradingView
        <ExternalLink size={14} />
      </a>

      <div>
        <p className="mb-2 text-xs font-medium text-[var(--text-secondary)]">Quick chart</p>
        <div className="h-[220px] overflow-hidden rounded-xl border border-[var(--border-color)]">
          <TradingViewWidget symbol={d.tradingViewSymbol} />
        </div>
      </div>
    </div>
  )
}

export default AssetDetailPanel
