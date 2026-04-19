import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card.jsx'
import Modal from '../components/ui/Modal.jsx'
import TvWidget from '../components/tv/TvWidget.jsx'
import PortfolioLineChart from '../components/charts/PortfolioLineChart.jsx'
import RecentTrades from '../components/RecentTrades.jsx'
import AssetDetailPanel from '../components/market/AssetDetailPanel.jsx'
import { ScrollTable, TabularWidget, TabularWidgetBody } from '../components/widgets/TabularWidget.jsx'
import {
  createDepthRows,
  createExecutionTape,
  fetchMarketTicker,
  generatePortfolioSeries,
  pushExecutionRow,
  tickDepthRows,
} from '../services/marketService.js'
import { useTheme } from '../hooks/useTheme.js'

// Market movers that navigate to symbol detail
const MOVER_SYMBOLS = [
  { sym: 'FOREXCOM:SPXUSD', label: 'S&P 500', badge: 'Index' },
  { sym: 'INDEX:NIFTY', label: 'NIFTY', badge: 'Index' },
  { sym: 'INDEX:SENSEX', label: 'SENSEX', badge: 'Index' },
  { sym: 'BINANCE:BTCUSDT', label: 'BTC', badge: 'Crypto' },
  { sym: 'BINANCE:ETHUSDT', label: 'ETH', badge: 'Crypto' },
  { sym: 'NASDAQ:AAPL', label: 'AAPL', badge: 'Stock' },
]

function DashboardPage() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [marketData, setMarketData] = useState([])
  const [portfolioSeries, setPortfolioSeries] = useState(generatePortfolioSeries())
  const [watchlist, setWatchlist] = useState(['BTCUSDT', 'ETHUSDT', 'SOLUSDT'])
  const [tape, setTape] = useState(() => createExecutionTape('BTCUSDT', 87300))
  const [depthRows, setDepthRows] = useState(() => createDepthRows('AGG'))
  const [sectors, setSectors] = useState(() => [
    { id: 's1', factor: 'Risk sentiment', reading: 'Risk-on', score: 58 },
    { id: 's2', factor: 'Volatility', reading: 'Compressed', score: 42 },
    { id: 's3', factor: 'USD liquidity', reading: 'Neutral', score: 51 },
    { id: 's4', factor: 'Crypto funding', reading: 'Slightly long', score: 63 },
  ])
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      const data = await fetchMarketTicker()
      if (active) setMarketData(data)
    }
    load()
    const interval = setInterval(() => {
      load()
      setPortfolioSeries(generatePortfolioSeries())
    }, 8000)
    return () => { active = false; clearInterval(interval) }
  }, [])

  useEffect(() => {
    const id = setInterval(() => setTape((p) => pushExecutionRow(p, 'BTCUSDT', 87300)), 1300)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setDepthRows((p) => tickDepthRows(p)), 2000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(
      () => setSectors((p) => p.map((s) => ({ ...s, score: Number(Math.min(92, Math.max(18, s.score + (Math.random() - 0.5) * 5)).toFixed(0)) }))),
      2600,
    )
    return () => clearInterval(id)
  }, [])

  const pnl = useMemo(() => marketData.reduce((acc, item) => acc + item.changePercent, 0), [marketData])
  const resolveAsset = (symbol) => marketData.find((m) => m.symbol === symbol)

  const openMarketDetail = (symbolOrAsset) => {
    if (!symbolOrAsset) return
    const asset = typeof symbolOrAsset === 'string' ? resolveAsset(symbolOrAsset) : symbolOrAsset
    if (asset) setDetail({ kind: 'market', asset })
  }

  const tapeColumns = [
    { key: 'time', label: 'Time' },
    { key: 'symbol', label: 'Sym' },
    { key: 'side', label: 'Side', render: (r) => <span className={r.side === 'BUY' ? 'text-green-400' : 'text-red-400'}>{r.side}</span> },
    { key: 'price', label: 'Px', align: 'right', render: (r) => <span className="font-mono">{r.price}</span> },
    { key: 'qty', label: 'Qty', align: 'right', render: (r) => <span className="font-mono">{r.qty}</span> },
  ]

  const depthColumns = [
    { key: 'symbol', label: 'Venue slice' },
    { key: 'bid', label: 'Bid', align: 'right', render: (r) => <span className="font-mono text-green-400">{r.bid}</span> },
    { key: 'ask', label: 'Ask', align: 'right', render: (r) => <span className="font-mono text-red-400">{r.ask}</span> },
    { key: 'imbalance', label: 'Imb', align: 'right', render: (r) => <span className={Number(r.imbalance) >= 0 ? 'text-green-400' : 'text-red-400'}>{r.imbalance}%</span> },
  ]

  const sectorColumns = [
    { key: 'factor', label: 'Factor' },
    { key: 'reading', label: 'Reading' },
    { key: 'score', label: 'Score', align: 'right', render: (r) => <span className="font-mono text-cyan-300">{r.score}</span> },
  ]

  return (
    <div className="space-y-6">
      {/* ── Row 1: KPI cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="cursor-pointer transition hover:ring-2 hover:ring-cyan-500/30" onClick={() => navigate('/portfolio')}>
          <p className="text-sm text-[var(--text-secondary)]">Total Balance</p>
          <h2 className="mt-2 text-3xl font-bold">$124,830.34</h2>
          <p className="mt-2 text-[11px] text-[var(--text-secondary)]">Click → portfolio</p>
        </Card>
        <Card className="cursor-pointer transition hover:ring-2 hover:ring-cyan-500/30" onClick={() => navigate('/trading')}>
          <p className="text-sm text-[var(--text-secondary)]">Today P/L</p>
          <h2 className={`mt-2 text-3xl font-bold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}%
          </h2>
          <p className="mt-2 text-[11px] text-[var(--text-secondary)]">Click → trade</p>
        </Card>
        <Card className="cursor-pointer transition hover:ring-2 hover:ring-cyan-500/30" onClick={() => navigate('/heatmap')}>
          <p className="text-sm text-[var(--text-secondary)]">Heatmap</p>
          <h2 className="mt-2 text-2xl font-bold">Sectors</h2>
          <p className="mt-2 text-[11px] text-[var(--text-secondary)]">Click → heatmap view</p>
        </Card>
        <Card className="cursor-pointer transition hover:ring-2 hover:ring-cyan-500/30" onClick={() => navigate('/insights')}>
          <p className="text-sm text-[var(--text-secondary)]">Insights</p>
          <h2 className="mt-2 text-2xl font-bold">News &amp; Cal.</h2>
          <p className="mt-2 text-[11px] text-[var(--text-secondary)]">Click → news &amp; calendar</p>
        </Card>
      </div>

      {/* ── Row 2: Market Summary (clickable symbols) ── */}
      <Card className="p-0 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-color)] px-4 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-cyan-400">Market Summary · Active / Gainers / Losers</p>
            <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">Click a symbol chip below to open full detail</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {MOVER_SYMBOLS.map((s) => (
              <button
                key={s.sym}
                type="button"
                onClick={() => navigate(`/market/${encodeURIComponent(s.sym)}`)}
                className="flex items-center gap-1 rounded-full border border-[var(--border-color)] bg-black/20 px-2.5 py-1 text-[11px] font-medium transition hover:bg-cyan-500/15 hover:border-cyan-500/40"
              >
                {s.label}
                <span className="rounded-full bg-cyan-500/15 px-1.5 text-[10px] text-cyan-300">{s.badge}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="p-3">
          <TvWidget kind="stock-market" theme={theme} heightClass="h-[280px]" />
        </div>
      </Card>

      {/* ── Row 3: Advanced Chart + Symbol Overview ── */}
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <h3 className="mb-2 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Advanced Chart · BTC/USDT</h3>
          <TvWidget kind="advanced-chart" symbol="BINANCE:BTCUSDT" theme={theme} heightClass="h-[420px]" />
        </div>
        <div className="xl:col-span-5">
          <h3 className="mb-2 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Symbol Overview · Apple</h3>
          <TvWidget kind="symbol-overview" symbol="NASDAQ:AAPL" theme={theme} heightClass="h-[420px]" />
        </div>
      </div>

      {/* ── Row 4: Market Overview (tabs: Indices / Futures / Bonds / Forex) ── */}
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <h3 className="mb-2 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Market Overview</h3>
          <TvWidget kind="market-overview" theme={theme} heightClass="h-[460px]" />
        </div>
        <div className="xl:col-span-7 space-y-4">
          {/* Watchlist */}
          <Card>
            <h3 className="mb-3 text-lg font-semibold">Watchlist</h3>
            <div className="space-y-2">
              {watchlist.map((asset) => {
                const live = resolveAsset(asset)
                return (
                  <button
                    key={asset}
                    type="button"
                    onClick={() => openMarketDetail(asset)}
                    className="flex w-full items-center justify-between rounded-lg bg-black/20 px-3 py-2 text-left text-sm transition hover:bg-cyan-500/10"
                  >
                    <span>{asset}</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      {live ? `$${live.price.toLocaleString()}` : '···'}
                    </span>
                  </button>
                )
              })}
              <button
                type="button"
                className="w-full rounded-lg border border-cyan-500/40 py-2 text-cyan-400 text-sm"
                onClick={() => setWatchlist((p) => [...new Set([...p, 'XRPUSDT'])])}
              >
                + Add XRPUSDT
              </button>
            </div>
          </Card>
          {/* Portfolio growth */}
          <Card>
            <h3 className="mb-3 text-lg font-semibold">Portfolio Growth</h3>
            <PortfolioLineChart data={portfolioSeries} />
          </Card>
        </div>
      </div>

      {/* ── Row 5: Market Quotes Table + Mini charts ── */}
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <h3 className="mb-2 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Market Quotes — Stocks &amp; Indices Table</h3>
          <TvWidget kind="market-quotes" theme={theme} heightClass="h-[420px]" />
        </div>
        <div className="xl:col-span-4 space-y-3">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Mini Charts</h3>
          {['NASDAQ:AAPL', 'BINANCE:BTCUSDT', 'INDEX:NIFTY'].map((sym) => (
            <button
              key={sym}
              type="button"
              className="w-full text-left"
              onClick={() => navigate(`/market/${encodeURIComponent(sym)}`)}
            >
              <p className="mb-1 text-[11px] text-[var(--text-secondary)] hover:text-cyan-400 transition">{sym} →</p>
              <TvWidget kind="mini-chart" symbol={sym} theme={theme} heightClass="h-[110px]" className="pointer-events-none" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Row 6: Live tables ── */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-0 overflow-hidden">
          <TabularWidget title="Live executions" subtitle="Cross-venue tape (mock)" badge="~1.3s">
            <TabularWidgetBody>
              <ScrollTable dense columns={tapeColumns} rows={tape} maxHeight="max-h-52" onRowClick={(row) => setDetail({ kind: 'tape', row })} />
            </TabularWidgetBody>
          </TabularWidget>
        </Card>
        <Card className="p-0 overflow-hidden">
          <TabularWidget title="Liquidity depth snapshot" subtitle="Synthetic imbalance by slice" badge="Updating">
            <TabularWidgetBody>
              <ScrollTable dense columns={depthColumns} rows={depthRows} maxHeight="max-h-52" onRowClick={(row) => setDetail({ kind: 'depth', row })} />
            </TabularWidgetBody>
          </TabularWidget>
        </Card>
      </div>

      {/* ── Row 7: Regime + Top movers + Recent trades ── */}
      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="p-0 overflow-hidden xl:col-span-5">
          <TabularWidget title="Regime dashboard" subtitle="Click a row for the narrative" badge="Macro mock">
            <TabularWidgetBody>
              <ScrollTable columns={sectorColumns} rows={sectors} rowKey="id" maxHeight="max-h-56" onRowClick={(row) => setDetail({ kind: 'sector', row })} />
            </TabularWidgetBody>
          </TabularWidget>
        </Card>
        <Card className="xl:col-span-4">
          <h3 className="mb-3 text-lg font-semibold">Top movers</h3>
          <div className="grid grid-cols-1 gap-2">
            {(marketData.length ? marketData : []).map((item) => (
              <button
                key={item.symbol}
                type="button"
                onClick={() => openMarketDetail(item)}
                className="flex items-center justify-between rounded-lg bg-black/20 p-2 text-left text-sm transition hover:bg-cyan-500/10"
              >
                <span>{item.symbol}</span>
                <span className={item.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {item.changePercent.toFixed(2)}%
                </span>
              </button>
            ))}
          </div>
        </Card>
        <Card className="xl:col-span-3">
          <h3 className="mb-3 text-lg font-semibold">Recent trades</h3>
          <RecentTrades onSelect={(trade) => setDetail({ kind: 'recent', trade })} />
        </Card>
      </div>

      {/* ── Detail Modal ── */}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={
          detail?.kind === 'market' ? detail.asset?.symbol
          : detail?.kind === 'tape' ? 'Execution'
          : detail?.kind === 'depth' ? 'Depth slice'
          : detail?.kind === 'sector' ? detail.row?.factor
          : detail?.kind === 'recent' ? `Fill · ${detail.trade?.asset}`
          : 'Details'
        }
        subtitle="Dashboard drill-down"
        wide={detail?.kind === 'market'}
      >
        {detail?.kind === 'market' && detail.asset ? <AssetDetailPanel asset={detail.asset} /> : null}
        {detail?.kind === 'tape' && detail.row ? (
          <div className="space-y-2 text-sm">
            <p>Time <span className="font-mono">{detail.row.time}</span></p>
            <p>{detail.row.side} {detail.row.qty} @ <span className="font-mono">{detail.row.price}</span></p>
            <p className="text-xs text-[var(--text-secondary)]">Synthetic print — wire your own websocket feed.</p>
          </div>
        ) : null}
        {detail?.kind === 'depth' && detail.row ? (
          <div className="space-y-2 text-sm">
            <p>Bid liquidity {detail.row.bid}</p>
            <p>Ask liquidity {detail.row.ask}</p>
            <p>Imbalance {detail.row.imbalance}%</p>
          </div>
        ) : null}
        {detail?.kind === 'sector' && detail.row ? (
          <div className="space-y-2 text-sm">
            <p>Reading: <strong>{detail.row.reading}</strong></p>
            <p>Score {detail.row.score} / 100 (mock oscillator)</p>
            <p className="text-xs text-[var(--text-secondary)]">Use this pattern for real macro factors: CPI prints, real yields, credit spreads, etc.</p>
          </div>
        ) : null}
        {detail?.kind === 'recent' && detail.trade ? (
          <div className="space-y-2 text-sm">
            <p>{detail.trade.side} {detail.trade.asset}</p>
            <p>Size {detail.trade.qty} @ {detail.trade.price}</p>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

export default DashboardPage
