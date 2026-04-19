import { Bell, Moon, Sun, Zap } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme.js'

const PAGE_TITLES = {
  '/':          { title: 'Dashboard',    sub: 'Multi-widget market workstation' },
  '/market':    { title: 'Markets',      sub: 'Live quotes, overview & screener' },
  '/portfolio': { title: 'Portfolio',    sub: 'Holdings, P/L & allocation' },
  '/trading':   { title: 'Trade',        sub: 'Advanced order entry & execution' },
  '/insights':  { title: 'Insights',     sub: 'News, calendar & economic data' },
  '/heatmap':   { title: 'Heatmaps',     sub: 'Stocks · Crypto · Forex performance' },
  '/settings':  { title: 'Settings',     sub: 'Account, appearance & API keys' },
}

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // resolve title for current path (support /market/:symbol)
  const routeKey = pathname.startsWith('/market/') ? '/market' : pathname
  const info = PAGE_TITLES[routeKey] ?? PAGE_TITLES['/']

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 px-5 py-3 backdrop-blur-xl">
      {/* Brand + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg transition hover:scale-105 active:scale-95"
          aria-label="Go to dashboard"
        >
          <Zap size={16} strokeWidth={2.5} />
        </button>
        <div className="min-w-0">
          <p className="truncate text-base font-bold leading-tight">{info.title}</p>
          <p className="truncate text-[11px] text-[var(--text-secondary)]">{info.sub}</p>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Notification bell */}
        <button
          type="button"
          className="relative rounded-lg border border-[var(--border-color)] bg-black/10 p-2 text-[var(--text-secondary)] transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
          aria-label="Notifications"
        >
          <Bell size={15} />
          {/* notification dot */}
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_rgba(6,182,212,0.8)]" />
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg border border-[var(--border-color)] bg-black/10 p-2 text-[var(--text-secondary)] transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Avatar */}
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/40 to-purple-500/30 text-xs font-bold transition-all hover:scale-105 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)]"
          aria-label="Settings"
        >
          DU
        </button>
      </div>
    </header>
  )
}

export default Navbar
