import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import MarketPage from './pages/MarketPage.jsx'
import MarketSymbolPage from './pages/MarketSymbolPage.jsx'
import PortfolioPage from './pages/PortfolioPage.jsx'
import TradingPage from './pages/TradingPage.jsx'
import InsightsPage from './pages/InsightsPage.jsx'
import HeatmapPage from './pages/HeatmapPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/market/:symbol" element={<MarketSymbolPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/trading" element={<TradingPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/heatmap" element={<HeatmapPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
