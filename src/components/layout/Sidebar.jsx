import {
  BarChart3,
  CandlestickChart,
  Flame,
  LayoutDashboard,
  Lightbulb,
  Settings,
  Wallet,
} from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

const links = [
  { to: '/',         label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/market',   label: 'Market',    icon: BarChart3 },
  { to: '/portfolio',label: 'Portfolio', icon: Wallet },
  { to: '/trading',  label: 'Trade',     icon: CandlestickChart },
  { to: '/insights', label: 'Insights',  icon: Lightbulb },
  { to: '/heatmap',  label: 'Heatmap',   icon: Flame },
  { to: '/settings', label: 'Settings',  icon: Settings },
]

function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="w-full shrink-0 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/60 backdrop-blur-xl md:sticky md:top-[57px] md:h-[calc(100vh-57px)] md:w-60 md:border-r md:border-b-0 md:overflow-y-auto">
      <nav className="flex gap-1 overflow-x-auto p-2 md:flex-col md:p-3">
        {links.map((link) => {
          const Icon   = link.icon
          const active = link.end
            ? pathname === link.to
            : pathname.startsWith(link.to)

          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={!!link.end}
              className={() =>
                [
                  'group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 whitespace-nowrap',
                  active
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-[inset_0_1px_0_rgba(6,182,212,0.15)]'
                    : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]',
                ].join(' ')
              }
            >
              {/* Active indicator bar */}
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.7)]" />
              )}
              <Icon
                size={16}
                className={`shrink-0 transition-transform duration-150 ${active ? 'text-cyan-400' : 'group-hover:scale-110'}`}
              />
              <span className="truncate">{link.label}</span>
              {/* Hover glow badge */}
              {!active && (
                <span className="ml-auto hidden h-1 w-1 rounded-full bg-cyan-500/0 transition-all group-hover:bg-cyan-500/60 md:block" />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom status badge */}
      <div className="hidden md:block px-3 pb-4 mt-auto">
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            <span className="text-[11px] font-semibold text-green-400">Markets open</span>
          </div>
          <p className="mt-0.5 text-[10px] text-[var(--text-secondary)]">NYSE · NASDAQ · NSE live</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
