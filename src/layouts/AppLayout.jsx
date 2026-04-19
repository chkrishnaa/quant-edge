import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'
import TickerTape from '../components/TickerTape.jsx'
import { useTheme } from '../hooks/useTheme.js'

function AppLayout() {
  const { theme }   = useTheme()
  const { pathname} = useLocation()
  const mainRef     = useRef(null)

  // Fade-in on every route change
  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(8px)'
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.28s ease, transform 0.28s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
    return () => cancelAnimationFrame(raf)
  }, [pathname])

  return (
    <div className="min-h-screen" data-theme={theme}>
      <TickerTape theme={theme} />
      <Navbar />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main
          ref={mainRef}
          className="min-w-0 flex-1 p-4 md:p-6"
          style={{ willChange: 'opacity, transform' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
