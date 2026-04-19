const trades = [
  { id: 1, side: 'BUY', asset: 'BTC', qty: '0.15', price: '$86,120' },
  { id: 2, side: 'SELL', asset: 'SOL', qty: '12', price: '$179' },
  { id: 3, side: 'BUY', asset: 'ETH', qty: '2.8', price: '$3,980' },
]

function RecentTrades({ onSelect }) {
  return (
    <div className="space-y-2">
      {trades.map((trade) => (
        <button
          key={trade.id}
          type="button"
          onClick={() => onSelect?.(trade)}
          className="flex w-full items-center justify-between rounded-lg bg-black/20 p-2 text-left text-sm transition hover:bg-cyan-500/10"
        >
          <div>
            <span className={trade.side === 'BUY' ? 'text-green-400' : 'text-red-400'}>{trade.side}</span> {trade.asset}
          </div>
          <div className="text-[var(--text-secondary)]">
            {trade.qty} @ {trade.price}
          </div>
        </button>
      ))}
    </div>
  )
}

export default RecentTrades
