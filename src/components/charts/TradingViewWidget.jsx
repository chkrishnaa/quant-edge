import { useEffect, useRef } from 'react'
import { cn } from '../../utils/cn.js'

function TradingViewWidget({ type = 'advanced', symbol = 'BINANCE:BTCUSDT', className, heightClass = 'h-[360px]' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: '30',
      timezone: 'Etc/UTC',
      theme: document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark',
      style: '1',
      locale: 'en',
      hide_top_toolbar: type !== 'advanced',
      allow_symbol_change: true,
      save_image: false,
    })
    container.appendChild(script)
  }, [symbol, type])

  return (
    <div className={cn('w-full overflow-hidden rounded-xl border border-[var(--border-color)]', heightClass, className)}>
      <div className="tradingview-widget-container h-full w-full" ref={containerRef} />
    </div>
  )
}

export default TradingViewWidget
