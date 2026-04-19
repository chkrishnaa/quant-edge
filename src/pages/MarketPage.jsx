import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card.jsx'
import Modal from '../components/ui/Modal.jsx'
import SparklineChart from '../components/charts/SparklineChart.jsx'
import TvWidget from '../components/tv/TvWidget.jsx'
import AssetDetailPanel from '../components/market/AssetDetailPanel.jsx'
import { ScrollTable, TabularWidget, TabularWidgetBody } from '../components/widgets/TabularWidget.jsx'
import {
  createDepthRows,
  fetchMarketTicker,
  getSparklineSeries,
  tickDepthRows,
} from '../services/marketService.js'
import { useTheme } from '../hooks/useTheme.js'

// Pre-defined navigable symbols
const SYMBOL_CHIPS = [
  { sym: 'NASDAQ:AAPL', label: 'Apple' },
  { sym: 'NASDAQ:GOOGL', label: 'Alphabet' },
  { sym: 'NASDAQ:MSFT', label: 'Microsoft' },
  { sym: 'NASDAQ:NVDA', label: 'NVIDIA' },
  { sym: 'NYSE:JPM', label: 'JPMorgan' },
  { sym: 'BINANCE:BTCUSDT', label: 'BTC' },
  { sym: 'BINANCE:ETHUSDT', label: 'ETH' },
  { sym: 'INDEX:NIFTY', label: 'NIFTY' },
  { sym: 'FOREXCOM:SPXUSD', label: 'S&P 500' },
]

function MarketPage() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [query, setQuery] = useState('')
  const [assets, setAssets] = useState([])
  const [selected, setSelected] = useState('BINANCE:BTCUSDT')
  const [detailAsset, setDetailAsset] = useState(null)
  const [depthRows, setDepthRows] = useState(() => createDepthRows('BTCUSDT'))

  useEffect(() => {
    let active = true
    const load = async () => {
      const data = await fetchMarketTicker()
      if (active) setAssets(data)
    }
    load()
    const id = setInterval(load, 6000)
    return () => { active = false; clearInterval(id) }
  }, [])

  const filtered = useMemo(
    () => assets.filter((asset) => asset.symbol.toLowerCase().includes(query.toLowerCase())),
    [assets, query],
  )

  const sparklines = useMemo(() => {
    const map = new Map()
    filtered.forEach((a) => { map.set(a.symbol, getSparklineSeries(a.symbol, a.changePercent >= 0)) })
    return map
  }, [filtered])

  const selectedSymbol = selected.replace('BINANCE:', '')

  useEffect(() => {
    setDepthRows(createDepthRows(selectedSymbol))
    const id = setInterval(() => setDepthRows((prev) => tickDepthRows(prev)), 1800)
    return () => clearInterval(id)
  }, [selectedSymbol])

  const openDetail = (asset) => {
    setDetailAsset(asset)
    setSelected(`BINANCE:${asset.symbol}`)
  }

  const depthColumns = [
    { key: 'symbol', label: 'Book' },
    { key: 'bid', label: 'Bid (mock)', align: 'right', render: (r) => <span className="font-mono text-green-400">{r.bid}</span> },
    { key: 'ask', label: 'Ask (mock)', align: 'right', render: (r) => <span className="font-mono text-red-400">{r.ask}</span> },
    { key: 'imbalance', label: 'Imb %', align: 'right', render: (r) => <span className={Number(r.imbalance) >= 0 ? 'text-green-400' : 'text-red-400'}>{r.imbalance}%</span> },
  ]

  return (
    <div className="space-y-5">
      {/* ── Header + symbol chip navigation ── */}
      <div>
        <h1 className="text-xl font-bold">Markets</h1>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Click any symbol chip below to open its full analysis page.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SYMBOL_CHIPS.map((s) => (
            <button
              key={s.sym}
              type="button"
              onClick={() => navigate(`/market/${encodeURIComponent(s.sym)}`)}
              className="rounded-full border border-[var(--border-color)] bg-black/20 px-3 py-1 text-xs font-medium transition hover:bg-cyan-500/15 hover:border-cyan-500/40 hover:text-cyan-300"
            >
              {s.label} →
            </button>
          ))}
        </div>
      </div>

      {/* ── Market Overview (Indices / Futures / Bonds / Forex tabs) ── */}
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <h3 className="mb-2 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Market Overview</h3>
          <TvWidget kind="market-overview" theme={theme} heightClass="h-[480px]" />
        </div>
        <div className="xl:col-span-7">
          <h3 className="mb-2 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Market Quotes — Stocks &amp; Crypto Table</h3>
          <TvWidget kind="market-quotes" theme={theme} heightClass="h-[480px]" />
        </div>
      </div>

      {/* ── Search + live table ── */}
      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-8">
          <label className="text-xs font-medium text-[var(--text-secondary)]">Search &amp; filter</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by symbol (e.g. BTC, ETH)..."
            className="mt-2 w-full rounded-xl border border-[var(--border-color)] bg-black/20 px-3 py-2.5 text-sm outline-none ring-cyan-500/40 transition focus:ring-2"
          />
          <p className="mt-2 text-[11px] text-[var(--text-secondary)]">
            Click any row for full detail. Symbol chips above navigate to the full analysis page.
          </p>
        </Card>
        <Card className="lg:col-span-4">
          <p className="text-xs font-medium text-[var(--text-secondary)]">Quick stats</p>
          <p className="mt-2 font-mono text-2xl font-bold">{filtered.length}</p>
          <p className="text-[11px] text-[var(--text-secondary)]">Universe matches · auto-refresh ~6s</p>
          <button
            type="button"
            onClick={() => fetchMarketTicker().then(setAssets)}
            className="mt-3 w-full rounded-lg border border-cyan-500/40 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/10"
          >
            Refresh now
          </button>
        </Card>
      </div>

      {/* ── Live asset table ── */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-black/25 text-[var(--text-secondary)]">
              <tr>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Price</th>
                <th className="px-3 py-3">24h %</th>
                <th className="px-3 py-3">Quote vol</th>
                <th className="px-3 py-3">Trend</th>
                <th className="px-3 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => (
                <tr
                  key={asset.symbol}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openDetail(asset) }}
                  onClick={() => openDetail(asset)}
                  className="cursor-pointer border-t border-[var(--border-color)] transition hover:bg-cyan-500/10"
                >
                  <td className="px-3 py-2.5 font-medium">{asset.symbol}</td>
                  <td className="px-3 py-2.5 font-mono">${asset.price.toLocaleString()}</td>
                  <td className={`px-3 py-2.5 font-mono ${asset.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[var(--text-secondary)]">
                    ${(asset.volume / 1e6).toFixed(2)}M
                  </td>
                  <td className="px-3 py-2.5">
                    <SparklineChart data={sparklines.get(asset.symbol) || []} positive={asset.changePercent >= 0} />
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); navigate(`/market/${encodeURIComponent('BINANCE:' + asset.symbol)}`) }}
                      className="rounded-lg bg-cyan-500/15 px-2.5 py-1 text-xs text-cyan-300 hover:bg-cyan-500/30 transition"
                    >
                      Full analysis →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Chart + Symbol Overview + Depth ── */}
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <h3 className="mb-2 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Symbol Overview · {selected}</h3>
          <TvWidget kind="symbol-overview" symbol={selected} theme={theme} heightClass="h-[380px]" />
        </div>
        <div className="xl:col-span-5">
          <h3 className="mb-2 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Advanced Chart · {selected}</h3>
          <TvWidget kind="advanced-chart" symbol={selected} theme={theme} heightClass="h-[380px]" />
        </div>
        <div className="xl:col-span-3 space-y-4">
          <TabularWidget
            title="Level-2 style depth"
            subtitle={`Synthetic book · ${selectedSymbol}`}
            badge="Mock"
          >
            <TabularWidgetBody>
              <ScrollTable
                dense
                columns={depthColumns}
                rows={depthRows}
                maxHeight="max-h-52"
                onRowClick={() => {
                  const a = assets.find((x) => x.symbol === selectedSymbol)
                  if (a) openDetail(a)
                }}
              />
            </TabularWidgetBody>
          </TabularWidget>
          <Card>
            <h4 className="text-sm font-semibold">Why click a row?</h4>
            <p className="mt-2 text-xs text-[var(--text-secondary)]">
              Opens a modal with 24h OHLC context, volumes, spread estimate, and a compact chart.
            </p>
          </Card>
        </div>
      </div>

      {/* ── Stock Screener ── */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Stock Screener</h3>
        <TvWidget kind="screener" theme={theme} heightClass="h-[480px]" />
      </div>

      <Modal
        open={!!detailAsset}
        onClose={() => setDetailAsset(null)}
        title={detailAsset?.symbol || 'Asset'}
        subtitle="Detailed quote · mock enrichment"
        wide
      >
        <AssetDetailPanel asset={detailAsset} />
      </Modal>
    </div>
  )
}

export default MarketPage
