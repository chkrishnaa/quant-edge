import { useEffect, useRef } from 'react'
import { useTheme } from './../hooks/useTheme.js'

/**
 * Global ticker tape at the very top.
 * Uses TradingView's ticker-tape embed with the required __widget inner div.
 */
function TickerTape({ theme = 'dark' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.innerHTML = ''

    // Required inner div
    const inner = document.createElement('div')
    inner.className = 'tradingview-widget-container__widget'
    inner.style.cssText = 'height:100%;width:100%;'
    ref.current.appendChild(inner)

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
        { proName: 'INDEX:NIFTY',      title: 'NIFTY' },
        { proName: 'INDEX:SENSEX',     title: 'SENSEX' },
        { proName: 'BINANCE:BTCUSDT',  title: 'BTC' },
        { proName: 'BINANCE:ETHUSDT',  title: 'ETH' },
        { proName: 'BINANCE:SOLUSDT',  title: 'SOL' },
        { proName: 'FX_IDC:USDINR',    title: 'USD/INR' },
        { proName: 'CME:GC1!',         title: 'Gold' },
        { proName: 'NYMEX:CL1!',       title: 'Crude Oil' },
        { proName: 'NASDAQ:NVDA',       title: 'NVDA' },
        { proName: 'NASDAQ:AAPL',       title: 'AAPL' },
      ],
      showSymbolLogo: true,
      colorTheme: theme === 'light' ? 'light' : 'dark',
      isTransparent: false,
      displayMode: 'regular',
      locale: 'en',
    })
    ref.current.appendChild(script)

    return () => { if (ref.current) ref.current.innerHTML = '' }
  }, [theme])

  return (
    <div className="relative border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
      {/* Edge glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'linear-gradient(90deg, rgba(6,182,212,0.14) 0%, transparent 30%, transparent 70%, rgba(6,182,212,0.10) 100%)',
        }}
      />
      <div className="relative flex items-stretch gap-0">
        {/* Live badge */}
        <div className="hidden w-[140px] shrink-0 flex-col justify-center border-r border-[var(--border-color)] bg-black/20 px-3 py-1.5 md:flex">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300/90">Live</span>
          </div>
          <p className="mt-0.5 text-[10px] leading-tight text-[var(--text-secondary)]">Global tape · delayed</p>
        </div>
        {/* Widget */}
        <div className="min-h-[46px] min-w-0 flex-1 py-1 pr-2 pl-2 md:pl-0">
          <div
            ref={ref}
            className="tradingview-widget-container h-full w-full"
            style={{ height: '100%' }}
          />
        </div>
      </div>
    </div>
  )
}

export default TickerTape
