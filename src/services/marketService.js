const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT']

export async function fetchMarketTicker() {
  try {
    const response = await fetch(
      'https://api.binance.com/api/v3/ticker/24hr?symbols=' +
        encodeURIComponent(JSON.stringify(symbols)),
    )
    const data = await response.json()
    return data.map((item) => ({
      symbol: item.symbol,
      price: Number(item.lastPrice),
      changePercent: Number(item.priceChangePercent),
      volume: Number(item.quoteVolume),
    }))
  } catch {
    return mockMarketData()
  }
}

export function mockMarketData() {
  return [
    { symbol: 'BTCUSDT', price: 87321, changePercent: 1.8, volume: 1200000000 },
    { symbol: 'ETHUSDT', price: 4020, changePercent: -0.7, volume: 650000000 },
    { symbol: 'BNBUSDT', price: 692, changePercent: 0.9, volume: 180000000 },
    { symbol: 'SOLUSDT', price: 182, changePercent: 2.4, volume: 420000000 },
    { symbol: 'XRPUSDT', price: 0.72, changePercent: -1.4, volume: 210000000 },
  ]
}

export function generatePortfolioSeries() {
  let value = 95000
  return Array.from({ length: 20 }, (_, index) => {
    value += (Math.random() - 0.35) * 3000
    return { name: `D${index + 1}`, value: Number(value.toFixed(2)) }
  })
}

function seededRandom(symbol) {
  let seed = 0
  for (let i = 0; i < symbol.length; i += 1) seed += symbol.charCodeAt(i)
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

export function getSparklineSeries(symbol, positive, points = 10) {
  const rand = seededRandom(symbol || 'SYM')
  let v = 40 + rand() * 20
  return Array.from({ length: points }, () => {
    const drift = (positive ? 1 : -1) * rand() * 6 + (rand() - 0.5) * 5
    v = Math.max(8, v + drift)
    return { value: Number(v.toFixed(2)) }
  })
}

export function enrichMarketAsset(asset) {
  const p = asset.price
  const pct = asset.changePercent / 100
  const open = p / (1 + pct || 1)
  const swing = Math.min(0.06, Math.abs(pct) * 0.4 + 0.003)
  const high = p * (1 + swing)
  const low = p * (1 - swing)
  const decimals = p < 1 ? 4 : p < 100 ? 2 : 2
  return {
    ...asset,
    open24h: Number(open.toFixed(decimals)),
    high24h: Number(high.toFixed(decimals)),
    low24h: Number(low.toFixed(decimals)),
    quoteVolume: asset.volume,
    baseVolume: Number((asset.volume / p).toFixed(2)),
    tradingViewSymbol: `BINANCE:${asset.symbol}`,
    spreadBps: (8 + Math.random() * 6).toFixed(1),
  }
}

export function buildOrderBook(midPrice) {
  const bids = []
  const asks = []
  for (let i = 0; i < 10; i += 1) {
    const bidP = midPrice * (1 - 0.00015 * (i + 1) - Math.random() * 0.00005)
    const askP = midPrice * (1 + 0.00015 * (i + 1) + Math.random() * 0.00005)
    bids.push({
      price: Number(bidP.toFixed(midPrice > 100 ? 2 : 4)),
      size: Number((Math.random() * 3 + 0.05).toFixed(4)),
      total: Number((Math.random() * 40 + 5).toFixed(2)),
    })
    asks.push({
      price: Number(askP.toFixed(midPrice > 100 ? 2 : 4)),
      size: Number((Math.random() * 3 + 0.05).toFixed(4)),
      total: Number((Math.random() * 40 + 5).toFixed(2)),
    })
  }
  return { bids, asks }
}

export function tickOrderBook(prev, midPrice) {
  return buildOrderBook(midPrice * (1 + (Math.random() - 0.5) * 0.0002))
}

export function createExecutionTape(symbol, priceHint) {
  const base = priceHint || 87000
  return Array.from({ length: 14 }, (_, i) => ({
    id: `ex-${i}-${symbol}`,
    time: new Date(Date.now() - i * 900).toLocaleTimeString(),
    symbol,
    side: Math.random() > 0.48 ? 'BUY' : 'SELL',
    price: Number((base * (1 + (Math.random() - 0.5) * 0.0008)).toFixed(2)),
    qty: Number((Math.random() * 0.8 + 0.02).toFixed(4)),
  }))
}

export function pushExecutionRow(prev, symbol, priceHint) {
  const base = priceHint || 87000
  const next = prev.slice(1)
  next.push({
    id: crypto.randomUUID(),
    time: new Date().toLocaleTimeString(),
    symbol,
    side: Math.random() > 0.48 ? 'BUY' : 'SELL',
    price: Number((base * (1 + (Math.random() - 0.5) * 0.0008)).toFixed(2)),
    qty: Number((Math.random() * 0.8 + 0.02).toFixed(4)),
  })
  return next
}

export function createOpenOrders() {
  return [
    { id: 'ord-1', symbol: 'BTCUSDT', side: 'BUY', type: 'LIMIT', qty: 0.12, price: 86850, filled: 0, status: 'OPEN' },
    { id: 'ord-2', symbol: 'ETHUSDT', side: 'SELL', type: 'LIMIT', qty: 2, price: 4055, filled: 0.5, status: 'PARTIAL' },
  ]
}

export function tickOpenOrders(prev) {
  return prev.map((row) => {
    if (row.status !== 'OPEN' && row.status !== 'PARTIAL') return row
    const delta = Math.random() > 0.85 ? Math.random() * 0.1 : 0
    const filled = Math.min(row.qty, row.filled + delta)
    let status = row.status
    if (filled >= row.qty * 0.999) status = 'FILLED'
    else if (filled > 0) status = 'PARTIAL'
    return { ...row, filled: Number(filled.toFixed(4)), status }
  })
}

export function createDepthRows(symbol) {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `d-${i}`,
    symbol,
    bid: Number((0.5 + Math.random() * 4).toFixed(2)),
    ask: Number((0.5 + Math.random() * 4).toFixed(2)),
    imbalance: Number(((Math.random() - 0.5) * 100).toFixed(1)),
  }))
}

export function tickDepthRows(prev) {
  return prev.map((r) => ({
    ...r,
    bid: Number((r.bid + (Math.random() - 0.5) * 0.4).toFixed(2)),
    ask: Number((r.ask + (Math.random() - 0.5) * 0.4).toFixed(2)),
    imbalance: Number((r.imbalance + (Math.random() - 0.5) * 8).toFixed(1)),
  }))
}

export function createTxnHistory() {
  const types = ['TRADE', 'DIVIDEND', 'FEE', 'DEPOSIT']
  return Array.from({ length: 12 }, (_, i) => ({
    id: `tx-${i}`,
    time: new Date(Date.now() - i * 3600000).toLocaleString(),
    type: types[i % types.length],
    symbol: ['BTC', 'ETH', 'SOL', '—'][i % 4],
    amount: Number(((Math.random() - 0.45) * 4200).toFixed(2)),
    status: 'SETTLED',
  }))
}

export function pushTxnRow(prev) {
  const next = prev.slice(1)
  next.push({
    id: crypto.randomUUID(),
    time: new Date().toLocaleString(),
    type: Math.random() > 0.7 ? 'DEPOSIT' : 'TRADE',
    symbol: ['BTC', 'ETH', 'SOL'][Math.floor(Math.random() * 3)],
    amount: Number(((Math.random() - 0.45) * 800).toFixed(2)),
    status: 'PENDING',
  })
  return next
}
