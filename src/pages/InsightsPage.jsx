import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card.jsx'
import TvWidget from '../components/tv/TvWidget.jsx'
import { useTheme } from '../hooks/useTheme.js'

const NAVIGATE_SYMBOLS = [
  { sym: 'FOREXCOM:SPXUSD', label: 'S&P 500',  badge: 'Index',  color: 'text-cyan-300 border-cyan-500/20 bg-cyan-500/10' },
  { sym: 'INDEX:NIFTY',     label: 'NIFTY 50',  badge: 'Index',  color: 'text-cyan-300 border-cyan-500/20 bg-cyan-500/10' },
  { sym: 'NASDAQ:AAPL',     label: 'Apple',     badge: 'Tech',   color: 'text-blue-300 border-blue-500/20 bg-blue-500/10' },
  { sym: 'NASDAQ:NVDA',     label: 'NVIDIA',    badge: 'Tech',   color: 'text-green-300 border-green-500/20 bg-green-500/10' },
  { sym: 'BINANCE:BTCUSDT', label: 'Bitcoin',   badge: 'Crypto', color: 'text-orange-300 border-orange-500/20 bg-orange-500/10' },
  { sym: 'BINANCE:ETHUSDT', label: 'Ethereum',  badge: 'Crypto', color: 'text-purple-300 border-purple-500/20 bg-purple-500/10' },
  { sym: 'CME:GC1!',        label: 'Gold',      badge: 'Commod', color: 'text-yellow-300 border-yellow-500/20 bg-yellow-500/10' },
  { sym: 'NYMEX:CL1!',      label: 'Crude Oil', badge: 'Commod', color: 'text-amber-300 border-amber-500/20 bg-amber-500/10' },
]

function InsightsPage() {
  const navigate = useNavigate()
  const { theme } = useTheme()

  return (
    <div className="space-y-6 fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Market Insights</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          News feed, economic calendar, forex rates, stock screener — click any symbol to open full analysis.
        </p>
      </div>

      {/* ── Market Summary strip — clickable symbols ───── */}
      <Card className="p-0 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-color)] px-4 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-cyan-400">
              Market Summary · Active / Gainers / Losers
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
              Click a symbol below to open full detail analysis
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 px-4 pb-3 pt-3">
          {NAVIGATE_SYMBOLS.map((s) => (
            <button
              key={s.sym}
              type="button"
              onClick={() => navigate(`/market/${encodeURIComponent(s.sym)}`)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all hover:scale-105 hover:shadow-lg ${s.color}`}
            >
              {s.label}
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px]">{s.badge}</span>
            </button>
          ))}
        </div>
        <div className="px-4 pb-4">
          <TvWidget kind="stock-market" theme={theme} heightClass="h-[300px]" />
        </div>
      </Card>

      {/* ── Market Quotes Table + Economic Calendar ─────── */}
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Market Quotes Table
          </p>
          <TvWidget kind="market-quotes" theme={theme} heightClass="h-[440px]" />
        </div>
        <div className="xl:col-span-7">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Economic Calendar
          </p>
          <TvWidget kind="economic-calendar" theme={theme} heightClass="h-[440px]" />
        </div>
      </div>

      {/* ── Stock Screener ───────────────────────────────── */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
          Stock Screener — Filter by any metric
        </p>
        <TvWidget kind="screener" theme={theme} heightClass="h-[520px]" />
      </div>

      {/* ── News Feed + Forex Rates ──────────────────────── */}
      <div className="grid gap-4 xl:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Market News Feed
          </p>
          <TvWidget kind="news" theme={theme} heightClass="h-[460px]" />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Forex Cross Rates
          </p>
          <TvWidget kind="forex-rates" theme={theme} heightClass="h-[460px]" />
        </div>
      </div>
    </div>
  )
}

export default InsightsPage
