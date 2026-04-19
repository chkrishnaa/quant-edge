import { useEffect, useRef } from 'react'
import { cn } from '../../utils/cn.js'

/**
 * Universal TradingView Widget wrapper.
 * Supports every widget type from the TradingView embed ecosystem.
 *
 * IMPORTANT: TradingView scripts inject content into an element with
 * class "tradingview-widget-container__widget" — that inner div MUST
 * exist before the script is appended, or widgets render blank.
 */

const WIDGET_SCRIPTS = {
  'advanced-chart':    'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js',
  'symbol-overview':   'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js',
  'mini-chart':        'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js',
  'market-overview':   'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js',
  'market-quotes':     'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js',
  'stock-market':      'https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js',
  'ticker-tape':       'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js',
  'screener':          'https://s3.tradingview.com/external-embedding/embed-widget-screener.js',
  'heatmap-stocks':    'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js',
  'heatmap-crypto':    'https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js',
  'heatmap-forex':     'https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js',
  'symbol-info':       'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js',
  'fundamental-data':  'https://s3.tradingview.com/external-embedding/embed-widget-fundamental-data.js',
  'company-profile':   'https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js',
  'financials':        'https://s3.tradingview.com/external-embedding/embed-widget-financials.js',
  'technical-analysis':'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js',
  'news':              'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js',
  'economic-calendar': 'https://s3.tradingview.com/external-embedding/embed-widget-events.js',
  'forex-rates':       'https://s3.tradingview.com/external-embedding/embed-widget-forex-rates.js',
}

function getDefaultConfig(kind, symbol, theme) {
  const colorTheme = theme === 'light' ? 'light' : 'dark'
  const base = { colorTheme, locale: 'en', isTransparent: true, autosize: true }

  switch (kind) {
    case 'advanced-chart':
      return {
        ...base,
        symbol,
        interval: '60',
        style: '1',
        allow_symbol_change: true,
        save_image: false,
        hide_top_toolbar: false,
        hide_legend: false,
        withdateranges: true,
      }

    case 'symbol-overview':
      return {
        ...base,
        symbols: [[symbol, `${symbol}|1D`]],
        chartType: 'area',
        lineColor: '#2962FF',
        topColor: 'rgba(41,98,255,0.3)',
        bottomColor: 'rgba(41,98,255,0)',
        dateRanges: ['1d|1', '1m|30', '3m|60', '12m|1D', '60m|1W'],
        showVolume: false,
        scalePosition: 'right',
        scaleMode: 'Normal',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '10',
        noTimeScale: false,
      }

    case 'mini-chart':
      return {
        ...base,
        symbol,
        dateRange: '12M',
        trendLineColor: '#06b6d4',
        underLineColor: 'rgba(6,182,212,0.12)',
        underLineBottomColor: 'rgba(0,0,0,0)',
        chartOnly: false,
        width: '100%',
        height: '100%',
      }

    case 'market-overview':
      return {
        ...base,
        showSymbolLogo: true,
        showFloatingTooltip: false,
        tabs: [
          {
            title: 'Indices', originalTitle: 'Indices',
            symbols: [
              { s: 'FOREXCOM:SPXUSD',  d: 'S&P 500' },
              { s: 'FOREXCOM:NSXUSD',  d: 'Nasdaq 100' },
              { s: 'INDEX:NIFTY',       d: 'NIFTY 50' },
              { s: 'INDEX:SENSEX',      d: 'SENSEX' },
              { s: 'INDEX:NKY',         d: 'Nikkei 225' },
              { s: 'FOREXCOM:DEU40',   d: 'DAX' },
            ],
          },
          {
            title: 'Futures', originalTitle: 'Futures',
            symbols: [
              { s: 'CME_MINI:ES1!', d: 'S&P 500 Futures' },
              { s: 'CME:GC1!',      d: 'Gold' },
              { s: 'NYMEX:CL1!',   d: 'Crude Oil' },
              { s: 'CBOT:ZB1!',    d: 'T-Bond' },
            ],
          },
          {
            title: 'Bonds', originalTitle: 'Bonds',
            symbols: [
              { s: 'TVC:US10Y', d: 'US 10Y' },
              { s: 'TVC:US02Y', d: 'US 2Y' },
              { s: 'TVC:IN10Y', d: 'India 10Y' },
            ],
          },
          {
            title: 'Forex', originalTitle: 'Forex',
            symbols: [
              { s: 'FX:EURUSD',      d: 'EUR/USD' },
              { s: 'FX:GBPUSD',      d: 'GBP/USD' },
              { s: 'FX_IDC:USDINR',  d: 'USD/INR' },
              { s: 'FX:USDJPY',      d: 'USD/JPY' },
            ],
          },
        ],
      }

    case 'market-quotes':
      return {
        ...base,
        showSymbolLogo: true,
        symbolsGroups: [
          {
            name: 'Indices', originalName: 'Indices',
            symbols: [
              { name: 'FOREXCOM:SPXUSD', displayName: 'S&P 500' },
              { name: 'FOREXCOM:NSXUSD', displayName: 'Nasdaq 100' },
              { name: 'INDEX:NIFTY',      displayName: 'NIFTY 50' },
              { name: 'INDEX:SENSEX',     displayName: 'SENSEX' },
            ],
          },
          {
            name: 'Financials', originalName: 'Financials',
            symbols: [
              { name: 'NYSE:JPM',  displayName: 'JPMorgan' },
              { name: 'NYSE:WFC',  displayName: 'Wells Fargo' },
              { name: 'NYSE:BAC',  displayName: 'Bank of America' },
              { name: 'NYSE:C',    displayName: 'Citigroup' },
              { name: 'NYSE:MS',   displayName: 'Morgan Stanley' },
            ],
          },
          {
            name: 'Technology', originalName: 'Technology',
            symbols: [
              { name: 'NASDAQ:AAPL',  displayName: 'Apple' },
              { name: 'NASDAQ:GOOGL', displayName: 'Alphabet' },
              { name: 'NASDAQ:MSFT',  displayName: 'Microsoft' },
              { name: 'NASDAQ:NVDA',  displayName: 'NVIDIA' },
              { name: 'NASDAQ:TSLA',  displayName: 'Tesla' },
            ],
          },
          {
            name: 'Crypto', originalName: 'Crypto',
            symbols: [
              { name: 'BINANCE:BTCUSDT', displayName: 'Bitcoin' },
              { name: 'BINANCE:ETHUSDT', displayName: 'Ethereum' },
              { name: 'BINANCE:SOLUSDT', displayName: 'Solana' },
              { name: 'BINANCE:BNBUSDT', displayName: 'BNB' },
            ],
          },
        ],
      }

    case 'stock-market':
      return {
        ...base,
        showSymbolLogo: true,
        showFloatingTooltip: false,
        listingType: 'percent',
        displayCurrency: 'USD',
        market: 'US',
      }

    case 'ticker-tape':
      return {
        ...base,
        symbols: [
          { proName: 'FOREXCOM:SPXUSD',  title: 'S&P 500' },
          { proName: 'INDEX:NIFTY',       title: 'NIFTY' },
          { proName: 'INDEX:SENSEX',      title: 'SENSEX' },
          { proName: 'BINANCE:BTCUSDT',   title: 'BTC' },
          { proName: 'BINANCE:ETHUSDT',   title: 'ETH' },
          { proName: 'FX_IDC:USDINR',     title: 'USD/INR' },
        ],
        showSymbolLogo: true,
        displayMode: 'regular',
      }

    case 'screener':
      return {
        ...base,
        defaultColumn: 'overview',
        defaultScreen: 'general',
        market: 'us',
        showToolbar: true,
      }

    case 'heatmap-stocks':
      return {
        ...base,
        exchanges: [],
        dataSource: 'SPX500',
        grouping: 'sector',
        blockSize: 'market_cap_basic',
        blockColor: 'change',
        hasTopBar: false,
        isDataSetEnabled: false,
        isZoomEnabled: true,
        hasSymbolTooltip: true,
      }

    case 'heatmap-crypto':
      return {
        ...base,
        dataSource: 'Crypto',
        blockSize: 'market_cap_calc',
        blockColor: 'change',
        hasTopBar: false,
      }

    case 'heatmap-forex':
      return {
        ...base,
        currencies: ['EUR', 'USD', 'JPY', 'GBP', 'CHF', 'AUD', 'CAD', 'NZD', 'CNY'],
      }

    case 'symbol-info':
      return { ...base, symbol }

    case 'fundamental-data':
      return { ...base, symbol, displayMode: 'regular', showSymbol: false }

    case 'company-profile':
      return { ...base, symbol, showSymbol: false }

    case 'financials':
      return { ...base, symbol, displayMode: 'regular', showSymbol: false }

    case 'technical-analysis':
      return { ...base, symbol, interval: '1D', showIntervalTabs: true }

    case 'news':
      return { ...base, feedMode: 'all_symbols', displayMode: 'regular' }

    case 'economic-calendar':
      return {
        ...base,
        importanceFilter: '-1,0,1',
        countryFilter: 'us,eu,jp,gb,cn,in',
      }

    case 'forex-rates':
      return {
        ...base,
        currencies: ['EUR', 'USD', 'JPY', 'GBP', 'CHF', 'AUD', 'CAD', 'NZD', 'INR'],
        showSymbol: false,
      }

    default:
      return base
  }
}

function TvWidget({
  kind        = 'advanced-chart',
  symbol      = 'NASDAQ:AAPL',
  config      = {},
  theme       = 'dark',
  className,
  heightClass = 'h-[420px]',
}) {
  const wrapRef      = useRef(null)  // outer sizing div
  const containerRef = useRef(null)  // tradingview-widget-container div

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ── Tear down previous widget ──────────────────────
    container.innerHTML = ''

    const resolvedTheme =
      document.documentElement.getAttribute('data-theme') ?? theme

    // ── Build proper DOM structure ─────────────────────
    // TradingView scripts REQUIRE the __widget inner div to exist
    // before the script executes — otherwise they silently fail.
    const innerDiv = document.createElement('div')
    innerDiv.className = 'tradingview-widget-container__widget'
    // Force fill the container
    innerDiv.style.cssText = 'width:100%;height:100%;'
    container.appendChild(innerDiv)

    const src = WIDGET_SCRIPTS[kind]
    if (!src) return

    const defaultCfg = getDefaultConfig(kind, symbol, resolvedTheme)
    const merged = { ...defaultCfg, ...config }

    const script = document.createElement('script')
    script.type  = 'text/javascript'
    script.src   = src
    script.async = true
    // Config is passed as the script body (TradingView's embed format)
    script.innerHTML = JSON.stringify(merged)
    container.appendChild(script)

    // ── Cleanup ────────────────────────────────────────
    return () => { container.innerHTML = '' }
  }, [kind, symbol, theme, JSON.stringify(config)])

  return (
    <div
      ref={wrapRef}
      className={cn(
        'overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]',
        heightClass,
        className,
      )}
      style={{ position: 'relative' }}
    >
      {/* tradingview-widget-container must be a direct parent with full h/w */}
      <div
        ref={containerRef}
        className="tradingview-widget-container"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default TvWidget
