import { useEffect, useMemo, useState } from 'react'
import { Activity, ChevronDown } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Modal from '../components/ui/Modal.jsx'
import TvWidget from '../components/tv/TvWidget.jsx'
import { useTheme } from '../hooks/useTheme.js'
import { useToast } from '../hooks/useToast.js'
import { ScrollTable, TabularWidget, TabularWidgetBody } from '../components/widgets/TabularWidget.jsx'
import {
  buildOrderBook,
  createExecutionTape,
  createOpenOrders,
  pushExecutionRow,
  tickOpenOrders,
  tickOrderBook,
} from '../services/marketService.js'

const INSTRUMENTS = [
  { symbol: 'BTCUSDT', label: 'BTC / USDT', mid: 87320 },
  { symbol: 'ETHUSDT', label: 'ETH / USDT', mid: 4025 },
  { symbol: 'SOLUSDT', label: 'SOL / USDT', mid: 182 },
]

function TradingPage() {
  const { theme } = useTheme()
  const [instrumentIdx, setInstrumentIdx] = useState(0)
  const instrument = INSTRUMENTS[instrumentIdx]
  const [mid, setMid] = useState(instrument.mid)
  const [book, setBook] = useState(() => buildOrderBook(instrument.mid))
  const [tape, setTape] = useState(() => createExecutionTape(instrument.symbol, instrument.mid))
  const [orders, setOrders] = useState(createOpenOrders)
  const [side, setSide] = useState('BUY')
  const [orderType, setOrderType] = useState('MARKET')
  const [qty, setQty] = useState('0.10')
  const [limitPrice, setLimitPrice] = useState(String(instrument.mid))
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [tif, setTif] = useState('GTC')
  const [postOnly, setPostOnly] = useState(false)
  const [reduceOnly, setReduceOnly] = useState(false)
  const { pushToast } = useToast()
  const [fillModal, setFillModal] = useState(null)

  useEffect(() => {
    const t = INSTRUMENTS[instrumentIdx]
    setMid(t.mid)
    setLimitPrice(String(t.mid))
    setBook(buildOrderBook(t.mid))
    setTape(createExecutionTape(t.symbol, t.mid))
  }, [instrumentIdx])

  useEffect(() => {
    const id = setInterval(() => {
      setMid((m) => {
        const decimals = m > 500 ? 2 : 4
        return Number((m * (1 + (Math.random() - 0.5) * 0.00012)).toFixed(decimals))
      })
    }, 1400)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setBook(() => tickOrderBook(null, mid)), 700)
    return () => clearInterval(id)
  }, [mid])

  useEffect(() => {
    const id = setInterval(() => {
      setTape((p) => pushExecutionRow(p, instrument.symbol, mid))
    }, 1100)
    return () => clearInterval(id)
  }, [instrument.symbol, mid])

  useEffect(() => {
    const id = setInterval(() => setOrders((o) => tickOpenOrders(o)), 2200)
    return () => clearInterval(id)
  }, [])

  const bestBid = book.bids[0]?.price
  const bestAsk = book.asks[0]?.price
  const spread = bestBid && bestAsk ? Number((bestAsk - bestBid).toFixed(4)) : null

  const effectivePrice =
    orderType === 'MARKET' ? (side === 'BUY' ? bestAsk ?? mid : bestBid ?? mid) : Number(limitPrice) || mid
  const estNotional = Number(qty || 0) * effectivePrice
  const feeRate = 0.0004
  const estFee = estNotional * feeRate

  const tvSymbol = useMemo(() => `BINANCE:${instrument.symbol}`, [instrument.symbol])

  const placeOrder = () => {
    const ok = Math.random() > 0.12
    pushToast(
      ok
        ? `${side} ${orderType} ${qty} ${instrument.symbol} · est. $${estNotional.toFixed(2)}`
        : `Order rejected · ${instrument.symbol}`,
      ok ? 'success' : 'error',
    )
  }

  const tapeColumns = [
    { key: 'time', label: 'Time' },
    { key: 'side', label: 'Side', render: (r) => <span className={r.side === 'BUY' ? 'text-green-400' : 'text-red-400'}>{r.side}</span> },
    { key: 'price', label: 'Price', align: 'right', render: (r) => <span className="font-mono">{r.price}</span> },
    { key: 'qty', label: 'Qty', align: 'right', render: (r) => <span className="font-mono">{r.qty}</span> },
  ]

  const orderColumns = [
    { key: 'symbol', label: 'Pair' },
    { key: 'side', label: 'Side', render: (r) => <span className={r.side === 'BUY' ? 'text-green-400' : 'text-red-400'}>{r.side}</span> },
    { key: 'type', label: 'Type' },
    { key: 'qty', label: 'Qty', align: 'right', render: (r) => <span className="font-mono">{r.qty}</span> },
    { key: 'price', label: 'Price', align: 'right', render: (r) => <span className="font-mono">{r.price}</span> },
    {
      key: 'filled',
      label: 'Filled',
      align: 'right',
      render: (r) => (
        <span className="font-mono text-[var(--text-secondary)]">
          {r.filled}/{r.qty}
        </span>
      ),
    },
    { key: 'status', label: 'Status', render: (r) => <span className="text-xs text-cyan-300">{r.status}</span> },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="space-y-4 xl:col-span-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Instrument</p>
            <div className="relative mt-2">
              <select
                value={instrumentIdx}
                onChange={(e) => setInstrumentIdx(Number(e.target.value))}
                className="w-full appearance-none rounded-xl border border-[var(--border-color)] bg-black/25 py-2.5 pl-3 pr-9 text-sm outline-none ring-cyan-500/30 focus:ring-2"
              >
                {INSTRUMENTS.map((row, i) => (
                  <option key={row.symbol} value={i}>
                    {row.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border-color)] bg-black/20 p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase text-[var(--text-secondary)]">Mid</p>
                <p className="font-mono text-xl font-bold">{mid}</p>
              </div>
              <div className="text-right text-[11px] text-[var(--text-secondary)]">
                <p>Spread {spread ?? '—'}</p>
                <p>
                  Best bid <span className="font-mono text-green-400">{bestBid ?? '—'}</span>
                </p>
                <p>
                  Best ask <span className="font-mono text-red-400">{bestAsk ?? '—'}</span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Order book</p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-lg border border-[var(--border-color)] bg-black/15 p-2">
                <p className="mb-1 text-[10px] text-green-400">Bids</p>
                <div className="max-h-40 space-y-1 overflow-y-auto">
                  {book.bids.map((b, i) => (
                    <div key={`b-${i}`} className="flex justify-between font-mono">
                      <span className="text-green-400">{b.price}</span>
                      <span className="text-[var(--text-secondary)]">{b.size}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-[var(--border-color)] bg-black/15 p-2">
                <p className="mb-1 text-[10px] text-red-400">Asks</p>
                <div className="max-h-40 space-y-1 overflow-y-auto">
                  {book.asks.map((a, i) => (
                    <div key={`a-${i}`} className="flex justify-between font-mono">
                      <span className="text-red-400">{a.price}</span>
                      <span className="text-[var(--text-secondary)]">{a.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4 xl:col-span-6">
          <Card className="p-0 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] px-4 py-3">
              <div className="flex items-center gap-2">
                <Activity className="text-cyan-400" size={18} />
                <div>
                  <p className="text-sm font-semibold">{instrument.label}</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">Chart + time & sales (mock)</p>
                </div>
              </div>
              <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] text-[var(--text-secondary)]">Live sim</span>
            </div>
            <TvWidget kind="advanced-chart" symbol={tvSymbol} theme={theme} heightClass="min-h-[320px] h-[380px]" className="rounded-none border-0 border-b border-[var(--border-color)]" />
            <TabularWidget title="Time & sales" subtitle="Click a row for fill metadata" badge="Updating">
              <TabularWidgetBody>
                <ScrollTable
                  dense
                  columns={tapeColumns}
                  rows={tape}
                  maxHeight="max-h-48"
                  onRowClick={(row) => setFillModal(row)}
                />
              </TabularWidgetBody>
            </TabularWidget>
          </Card>
        </div>

        <Card className="space-y-3 xl:col-span-3">
          <div className="grid grid-cols-2 gap-2">
            {['BUY', 'SELL'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                className={`rounded-xl py-2 text-sm font-semibold transition ${
                  side === s ? (s === 'BUY' ? 'bg-green-500/25 text-green-400' : 'bg-red-500/25 text-red-400') : 'bg-black/20 text-[var(--text-secondary)]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-[var(--text-secondary)]">Order type</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--border-color)] bg-black/20 p-2"
              >
                <option>MARKET</option>
                <option>LIMIT</option>
                <option>STOP_LIMIT</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-secondary)]">Time in force</label>
              <select value={tif} onChange={(e) => setTif(e.target.value)} className="mt-1 w-full rounded-lg border border-[var(--border-color)] bg-black/20 p-2">
                <option>GTC</option>
                <option>IOC</option>
                <option>FOK</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[var(--text-secondary)]">Quantity</label>
            <input value={qty} onChange={(e) => setQty(e.target.value)} className="mt-1 w-full rounded-lg border border-[var(--border-color)] bg-black/20 p-2 font-mono text-sm" />
          </div>

          <div>
            <label className="text-[10px] text-[var(--text-secondary)]">Limit price</label>
            <input
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              disabled={orderType === 'MARKET'}
              className="mt-1 w-full rounded-lg border border-[var(--border-color)] bg-black/20 p-2 font-mono text-sm disabled:opacity-40"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-[var(--text-secondary)]">Stop loss</label>
              <input value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} placeholder="Optional" className="mt-1 w-full rounded-lg border border-[var(--border-color)] bg-black/20 p-2 text-sm" />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-secondary)]">Take profit</label>
              <input value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} placeholder="Optional" className="mt-1 w-full rounded-lg border border-[var(--border-color)] bg-black/20 p-2 text-sm" />
            </div>
          </div>

          <label className="flex items-center justify-between text-xs">
            Post-only
            <input type="checkbox" checked={postOnly} onChange={() => setPostOnly((v) => !v)} />
          </label>
          <label className="flex items-center justify-between text-xs">
            Reduce-only
            <input type="checkbox" checked={reduceOnly} onChange={() => setReduceOnly((v) => !v)} />
          </label>

          <div className="space-y-1 rounded-xl border border-[var(--border-color)] bg-black/25 p-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Est. price</span>
              <span className="font-mono">{effectivePrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Notional</span>
              <span className="font-mono">${estNotional.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Fees (mock 4bps)</span>
              <span className="font-mono">${estFee.toFixed(4)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={placeOrder}
            className={`w-full rounded-xl py-3 text-sm font-bold text-black ${
              side === 'BUY' ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400'
            }`}
          >
            {side} {instrument.symbol}
          </button>
        </Card>
      </div>

      {/* Symbol Overview + Technical Analysis */}
      <div className="grid gap-4 xl:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Symbol Overview · {instrument.symbol}</h3>
          <TvWidget kind="symbol-overview" symbol={tvSymbol} theme={theme} heightClass="h-[320px]" />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Technical Analysis · {instrument.symbol}</h3>
          <TvWidget kind="technical-analysis" symbol={tvSymbol} theme={theme} heightClass="h-[320px]" />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <TabularWidget title="Working orders" subtitle="Simulated partial fills · click row" badge="OMS mock">
          <TabularWidgetBody>
            <ScrollTable columns={orderColumns} rows={orders} rowKey="id" maxHeight="max-h-56" onRowClick={(row) => setFillModal({ ...row, kind: 'order' })} />
          </TabularWidgetBody>
        </TabularWidget>
      </Card>

      <Modal
        open={!!fillModal}
        onClose={() => setFillModal(null)}
        title={fillModal?.kind === 'order' ? `Order ${fillModal.id}` : 'Execution detail'}
        subtitle={fillModal?.symbol || instrument.symbol}
      >
        {fillModal ? (
          <div className="space-y-2 text-sm">
            {fillModal.kind === 'order' ? (
              <>
                <p>
                  <span className="text-[var(--text-secondary)]">Side:</span> {fillModal.side}
                </p>
                <p>
                  <span className="text-[var(--text-secondary)]">Type:</span> {fillModal.type}
                </p>
                <p>
                  <span className="text-[var(--text-secondary)]">Qty / Filled:</span>{' '}
                  <span className="font-mono">
                    {fillModal.filled} / {fillModal.qty}
                  </span>
                </p>
                <p>
                  <span className="text-[var(--text-secondary)]">Limit:</span> <span className="font-mono">{fillModal.price}</span>
                </p>
                <p>
                  <span className="text-[var(--text-secondary)]">Status:</span> {fillModal.status}
                </p>
              </>
            ) : (
              <>
                <p>
                  <span className="text-[var(--text-secondary)]">Time:</span> {fillModal.time}
                </p>
                <p>
                  <span className="text-[var(--text-secondary)]">Side:</span> {fillModal.side}
                </p>
                <p>
                  <span className="text-[var(--text-secondary)]">Price × Qty:</span>{' '}
                  <span className="font-mono">
                    {fillModal.price} × {fillModal.qty}
                  </span>
                </p>
                <p className="text-[11px] text-[var(--text-secondary)]">Synthetic liquidity event for UI demo.</p>
              </>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

export default TradingPage
