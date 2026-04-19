import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import Card from '../components/ui/Card.jsx'
import Modal from '../components/ui/Modal.jsx'
import TvWidget from '../components/tv/TvWidget.jsx'
import HoldingDetailPanel from '../components/portfolio/HoldingDetailPanel.jsx'
import { ScrollTable, TabularWidget, TabularWidgetBody } from '../components/widgets/TabularWidget.jsx'
import { createTxnHistory, pushTxnRow } from '../services/marketService.js'
import { useTheme } from '../hooks/useTheme.js'

const holdings = [
  { asset: 'BTC', quantity: 0.8, avg: 62800, current: 87300 },
  { asset: 'ETH', quantity: 8, avg: 2600, current: 4020 },
  { asset: 'SOL', quantity: 120, avg: 100, current: 182 },
]

function PortfolioPage() {
  const navigate = useNavigate()
  const table = holdings.map((h) => ({
    ...h,
    pnl: (h.current - h.avg) * h.quantity,
    invested: h.avg * h.quantity,
    value: h.current * h.quantity,
  }))
  const totalPnl = table.reduce((acc, item) => acc + item.pnl, 0)
  const totalInvested = table.reduce((acc, item) => acc + item.invested, 0)

  const [holdingModal, setHoldingModal] = useState(null)
  const [txns, setTxns] = useState(createTxnHistory)
  const [txnModal, setTxnModal] = useState(null)
  const { theme } = useTheme()

  useEffect(() => {
    const id = setInterval(() => setTxns((p) => pushTxnRow(p)), 3200)
    return () => clearInterval(id)
  }, [])

  const txnColumns = [
    { key: 'time', label: 'Time' },
    { key: 'type', label: 'Type', render: (r) => <span className="text-cyan-300">{r.type}</span> },
    { key: 'symbol', label: 'Symbol' },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (r) => (
        <span className={`font-mono ${r.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>${r.amount.toFixed(2)}</span>
      ),
    },
    { key: 'status', label: 'Status', render: (r) => <span className="text-[11px] text-[var(--text-secondary)]">{r.status}</span> },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Card
        className="cursor-pointer transition hover:ring-2 hover:ring-cyan-500/25 xl:col-span-4"
        onClick={() => navigate('/trading')}
      >
        <p className="text-sm text-[var(--text-secondary)]">Invested</p>
        <h3 className="text-2xl font-bold">${totalInvested.toFixed(2)}</h3>
        <p className="mt-2 text-[11px] text-[var(--text-secondary)]">Click to open trade ticket →</p>
      </Card>
      <Card className="xl:col-span-4">
        <p className="text-sm text-[var(--text-secondary)]">Unrealized P/L</p>
        <h3 className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>${totalPnl.toFixed(2)}</h3>
      </Card>
      <Card className="xl:col-span-4">
        <p className="text-sm text-[var(--text-secondary)]">Returns</p>
        <h3 className="text-2xl font-bold">{((totalPnl / totalInvested) * 100).toFixed(2)}%</h3>
      </Card>

      <Card className="xl:col-span-7">
        <h3 className="mb-3 text-lg font-semibold">Holdings</h3>
        <p className="mb-2 text-xs text-[var(--text-secondary)]">Rows are clickable for position detail.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-[var(--text-secondary)]">
              <tr>
                <th className="py-2">Asset</th>
                <th>Qty</th>
                <th>Avg</th>
                <th>Last</th>
                <th>P/L</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row) => (
                <tr
                  key={row.asset}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setHoldingModal(row)
                  }}
                  onClick={() => setHoldingModal(row)}
                  className="cursor-pointer border-t border-[var(--border-color)] transition hover:bg-cyan-500/10"
                >
                  <td className="py-2.5 font-medium">{row.asset}</td>
                  <td className="font-mono">{row.quantity}</td>
                  <td className="font-mono">${row.avg.toLocaleString()}</td>
                  <td className="font-mono">${row.current.toLocaleString()}</td>
                  <td className={`font-mono ${row.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>${row.pnl.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card className="xl:col-span-5">
        <h3 className="mb-3 text-lg font-semibold">Asset allocation</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={table} dataKey="value" nameKey="asset" outerRadius={110}>
                {table.map((entry, index) => (
                  <Cell key={entry.asset} fill={['#06b6d4', '#22c55e', '#ef4444'][index % 3]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ── Mini charts for each holding ── */}
      <div className="xl:col-span-12">
        <h3 className="mb-3 text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Holding charts · Symbol Overview</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { sym: 'BINANCE:BTCUSDT', label: 'BTC' },
            { sym: 'BINANCE:ETHUSDT', label: 'ETH' },
            { sym: 'BINANCE:SOLUSDT', label: 'SOL' },
          ].map((h) => (
            <div key={h.sym}>
              <button
                type="button"
                onClick={() => navigate(`/market/${encodeURIComponent(h.sym)}`)}
                className="mb-1 text-xs text-cyan-400 hover:underline"
              >
                {h.label} — full analysis →
              </button>
              <TvWidget kind="symbol-overview" symbol={h.sym} theme={theme} heightClass="h-[220px]" />
            </div>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden xl:col-span-12">
        <TabularWidget title="Account activity" subtitle="Ledger + cash events (mock stream)" badge="Live">
          <TabularWidgetBody>
            <ScrollTable
              columns={txnColumns}
              rows={txns}
              rowKey="id"
              maxHeight="max-h-64"
              onRowClick={(row) => setTxnModal(row)}
            />
          </TabularWidgetBody>
        </TabularWidget>
      </Card>

      <Modal open={!!holdingModal} onClose={() => setHoldingModal(null)} title={holdingModal?.asset || 'Position'} subtitle="Spot holding">
        {holdingModal ? <HoldingDetailPanel row={holdingModal} /> : null}
      </Modal>

      <Modal open={!!txnModal} onClose={() => setTxnModal(null)} title={txnModal?.type || 'Ledger'} subtitle={txnModal?.symbol || ''}>
        {txnModal ? (
          <div className="space-y-2 text-sm">
            <p className="text-[var(--text-secondary)]">{txnModal.time}</p>
            <p>
              Amount <span className="font-mono">${txnModal.amount.toFixed(2)}</span>
            </p>
            <p>Status {txnModal.status}</p>
            <p className="text-xs text-[var(--text-secondary)]">Click-through pattern for statements / tax lots.</p>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

export default PortfolioPage
