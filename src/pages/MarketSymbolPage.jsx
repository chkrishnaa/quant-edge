import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, TrendingUp } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import TvWidget from '../components/tv/TvWidget.jsx'
import { useTheme } from '../hooks/useTheme.js'

const POPULAR = [
  { sym: 'NASDAQ:AAPL',    label: 'Apple',     color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
  { sym: 'NASDAQ:GOOGL',   label: 'Alphabet',  color: 'bg-green-500/10 text-green-300 border-green-500/20' },
  { sym: 'NASDAQ:MSFT',    label: 'Microsoft', color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
  { sym: 'NASDAQ:NVDA',    label: 'NVIDIA',    color: 'bg-green-500/10 text-green-300 border-green-500/20' },
  { sym: 'NASDAQ:TSLA',    label: 'Tesla',     color: 'bg-red-500/10 text-red-300 border-red-500/20' },
  { sym: 'NYSE:JPM',       label: 'JPMorgan',  color: 'bg-slate-500/10 text-slate-300 border-slate-500/20' },
  { sym: 'BINANCE:BTCUSDT',label: 'BTC',       color: 'bg-orange-500/10 text-orange-300 border-orange-500/20' },
  { sym: 'BINANCE:ETHUSDT',label: 'ETH',       color: 'bg-purple-500/10 text-purple-300 border-purple-500/20' },
  { sym: 'BINANCE:SOLUSDT',label: 'SOL',       color: 'bg-violet-500/10 text-violet-300 border-violet-500/20' },
  { sym: 'INDEX:NIFTY',    label: 'NIFTY',     color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' },
  { sym: 'FOREXCOM:SPXUSD',label: 'S&P 500',   color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' },
]

function MarketSymbolPage() {
  const { symbol } = useParams()
  const navigate   = useNavigate()
  const { theme }  = useTheme()

  const sym = symbol ? decodeURIComponent(symbol) : 'NASDAQ:AAPL'
  const shortLabel = POPULAR.find(p => p.sym === sym)?.label ?? sym.split(':')[1] ?? sym

  return (
    <div className="space-y-5 fade-in-up">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/market')}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-black/20 px-3 py-1.5 text-sm text-[var(--text-secondary)] transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            <ArrowLeft size={14} /> Market
          </button>
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-cyan-400" />
            <div>
              <h1 className="text-xl font-bold">{shortLabel}</h1>
              <p className="text-[11px] text-[var(--text-secondary)]">{sym} · Full analysis</p>
            </div>
          </div>
        </div>
        <a
          href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(sym)}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-300 transition-all hover:bg-cyan-500/20"
        >
          Open on TradingView <ExternalLink size={12} />
        </a>
      </div>

      {/* ── Symbol chips ───────────────────────────────── */}
      <Card className="p-3">
        <div className="flex flex-wrap gap-2">
          {POPULAR.map((p) => (
            <button
              key={p.sym}
              type="button"
              onClick={() => navigate(`/market/${encodeURIComponent(p.sym)}`)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all hover:scale-105 ${
                sym === p.sym
                  ? 'bg-cyan-500/25 border-cyan-500/50 text-cyan-200'
                  : `${p.color} hover:border-opacity-60`
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </Card>

      {/* ── Symbol Info bar (auto height) ──────────────── */}
      <div>
        <TvWidget kind="symbol-info" symbol={sym} theme={theme} heightClass="h-[180px]" />
      </div>

      {/* ── Advanced Chart (full width) ─────────────────── */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Advanced Chart</p>
        <TvWidget kind="advanced-chart" symbol={sym} theme={theme} heightClass="h-[520px]" />
      </div>

      {/* ── Technical Analysis + Mini Chart (side by side) */}
      <div className="grid gap-4 xl:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Technical Analysis</p>
          <TvWidget kind="technical-analysis" symbol={sym} theme={theme} heightClass="h-[420px]" />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Symbol Overview · Price History</p>
          <TvWidget kind="symbol-overview" symbol={sym} theme={theme} heightClass="h-[420px]" />
        </div>
      </div>

      {/* ── Mini Chart strip ──────────────────────────── */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Mini Chart · 12-Month</p>
        <TvWidget kind="mini-chart" symbol={sym} theme={theme} heightClass="h-[220px]" />
      </div>

      {/* ── Fundamentals — 3 columns ───────────────────── */}
      <div className="grid gap-4 xl:grid-cols-3">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Company Profile</p>
          <TvWidget kind="company-profile" symbol={sym} theme={theme} heightClass="h-[400px]" />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Fundamental Data</p>
          <TvWidget kind="fundamental-data" symbol={sym} theme={theme} heightClass="h-[400px]" />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Financials</p>
          <TvWidget kind="financials" symbol={sym} theme={theme} heightClass="h-[400px]" />
        </div>
      </div>
    </div>
  )
}

export default MarketSymbolPage
