import { useState } from 'react'
import TvWidget from '../components/tv/TvWidget.jsx'
import { useTheme } from '../hooks/useTheme.js'

const TABS = [
  {
    id: 'stocks', label: 'Stocks',
    emoji: '🟦', kind: 'heatmap-stocks',
    desc: 'S&P 500 sectors — color = daily % change',
  },
  {
    id: 'crypto', label: 'Crypto',
    emoji: '🟡', kind: 'heatmap-crypto',
    desc: 'Top cryptocurrencies by market cap',
  },
  {
    id: 'forex', label: 'Forex',
    emoji: '💱', kind: 'heatmap-forex',
    desc: 'Major currency pair performance matrix',
  },
]

function HeatmapPage() {
  const [active, setActive] = useState('stocks')
  const { theme } = useTheme()
  const current = TABS.find((t) => t.id === active)

  return (
    <div className="space-y-6 fade-in-up">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Market Heatmaps</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {current.desc}
          </p>
        </div>
        {/* Tab switcher */}
        <div className="flex gap-1.5 rounded-xl border border-[var(--border-color)] bg-black/20 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                active === tab.id
                  ? 'bg-cyan-500/25 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main heatmap ─────────────────────────────── */}
      <TvWidget key={current.id} kind={current.kind} theme={theme} heightClass="h-[580px]" />

      {/* ── Market Overview ──────────────────────────── */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
          Market Overview — Indices · Futures · Bonds · Forex
        </p>
        <TvWidget kind="market-overview" theme={theme} heightClass="h-[460px]" />
      </div>

      {/* ── Market Quotes + Economic Calendar ─────────── */}
      <div className="grid gap-4 xl:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Market Quotes — Global Snapshot
          </p>
          <TvWidget kind="market-quotes" theme={theme} heightClass="h-[400px]" />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Forex Cross Rates
          </p>
          <TvWidget kind="forex-rates" theme={theme} heightClass="h-[400px]" />
        </div>
      </div>
    </div>
  )
}

export default HeatmapPage
