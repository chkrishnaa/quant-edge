import { useState } from 'react'
import {
  Bell,
  CreditCard,
  KeyRound,
  Palette,
  Shield,
  SlidersHorizontal,
  User,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import { useTheme } from '../hooks/useTheme.js'

/* ─── Reusable sub-components ─────────────────────── */

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15">
        <Icon size={18} className="text-cyan-400" />
      </div>
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        {description && <p className="text-xs text-[var(--text-secondary)]">{description}</p>}
      </div>
    </div>
  )
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-[var(--border-color)] bg-black/10 px-4 py-3 transition-all hover:bg-cyan-500/5 hover:border-cyan-500/20">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{description}</p>}
      </div>
      <div className="relative mt-0.5 shrink-0">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <div className={`h-5 w-9 rounded-full transition-colors ${checked ? 'bg-cyan-500' : 'bg-white/10'}`} />
        <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
    </label>
  )
}

function FieldRow({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">{label}</label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full rounded-xl border border-[var(--border-color)] bg-black/20 px-3 py-2.5 text-sm outline-none ring-cyan-500/40 transition placeholder:text-[var(--text-secondary)]/50 focus:ring-2 hover:border-cyan-500/30'

/* ─── Settings Page ───────────────────────────────── */

function SettingsPage() {
  const { theme, toggleTheme, setTheme } = useTheme()

  // Notification state
  const [emailDigest,  setEmailDigest]  = useState(true)
  const [pushExec,     setPushExec]     = useState(true)
  const [pushNews,     setPushNews]     = useState(false)
  const [pushAlerts,   setPushAlerts]   = useState(true)

  // Trading state
  const [mockTrading,    setMockTrading]    = useState(true)
  const [confirmOrders,  setConfirmOrders]  = useState(true)
  const [defaultLeverage,setDefaultLeverage]= useState('3')
  const [defaultQty,     setDefaultQty]     = useState('0.10')

  // Security state
  const [twoFa,           setTwoFa]           = useState(false)
  const [withdrawalLock,  setWithdrawalLock]  = useState(true)
  const [ipWhitelist,     setIpWhitelist]     = useState(false)

  // API state
  const [apiKey,     setApiKey]     = useState('')
  const [apiSecret,  setApiSecret]  = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [testStatus, setTestStatus] = useState(null)

  const handleTestConnection = () => {
    setTestStatus('loading')
    setTimeout(() => setTestStatus(apiKey ? 'success' : 'error'), 1200)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Manage your account, appearance, trading defaults, and security.
        </p>
      </div>

      {/* ── 1. Account ──────────────────────────────── */}
      <Card className="space-y-5">
        <SectionHeader icon={User} title="Account" description="Your profile and timezone preferences." />

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/40 to-purple-500/30 text-2xl font-bold shadow-lg">
            DU
          </div>
          <div>
            <p className="font-semibold">Demo User</p>
            <p className="text-sm text-[var(--text-secondary)]">trader@example.com · Pro plan</p>
            <span className="mt-1 inline-block rounded-full bg-green-500/15 px-2 py-0.5 text-[11px] font-medium text-green-400">
              KYC verified (mock)
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow label="Display name">
            <input className={inputCls} defaultValue="Demo User" />
          </FieldRow>
          <FieldRow label="Email address">
            <input className={inputCls} defaultValue="trader@example.com" type="email" />
          </FieldRow>
          <FieldRow label="Timezone">
            <select className={inputCls}>
              <option>UTC</option>
              <option>Asia/Kolkata</option>
              <option>America/New_York</option>
              <option>Europe/London</option>
              <option>Asia/Tokyo</option>
            </select>
          </FieldRow>
          <FieldRow label="Language">
            <select className={inputCls}>
              <option>English</option>
              <option>Hindi</option>
              <option>Japanese</option>
            </select>
          </FieldRow>
        </div>

        <button
          type="button"
          className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-cyan-400 active:scale-95"
        >
          Save changes
        </button>
      </Card>

      {/* ── 2. Appearance ───────────────────────────── */}
      <Card className="space-y-5">
        <SectionHeader icon={Palette} title="Appearance" description="Theme and density settings for the dashboard." />

        <div>
          <p className="mb-3 text-sm text-[var(--text-secondary)]">
            Theme drives backgrounds, cards, and TradingView widget colors.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {['dark', 'light'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`relative rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                  theme === t
                    ? 'border-cyan-500/60 bg-cyan-500/20 text-cyan-300'
                    : 'border-[var(--border-color)] bg-black/10 text-[var(--text-secondary)] hover:border-cyan-500/30 hover:bg-cyan-500/5'
                }`}
              >
                {t === 'dark' ? '🌙 Dark' : '☀️ Light'}
                {theme === t && (
                  <Check size={12} className="absolute right-2 top-2 text-cyan-400" />
                )}
              </button>
            ))}
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl border border-[var(--border-color)] bg-black/10 px-4 py-3 text-sm text-[var(--text-secondary)] transition-all hover:border-cyan-500/30 hover:bg-cyan-500/5"
            >
              🔄 Toggle
            </button>
          </div>
        </div>

        <FieldRow label="Table density">
          <select className={inputCls + ' max-w-xs'}>
            <option>Comfortable</option>
            <option>Compact</option>
            <option>Spacious</option>
          </select>
        </FieldRow>

        <FieldRow label="Chart default interval">
          <select className={inputCls + ' max-w-xs'}>
            <option>1m</option>
            <option>5m</option>
            <option>15m</option>
            <option selected>1h</option>
            <option>4h</option>
            <option>1D</option>
            <option>1W</option>
          </select>
        </FieldRow>
      </Card>

      {/* ── 3. Notifications ────────────────────────── */}
      <Card className="space-y-4">
        <SectionHeader icon={Bell} title="Notifications" description="Control which alerts and digests reach you." />
        <div className="space-y-3">
          <Toggle label="Email daily digest"        description="P&L summary and watchlist movers."            checked={emailDigest} onChange={setEmailDigest} />
          <Toggle label="Push · order executions"   description="Fills, cancels, and rejections."              checked={pushExec}    onChange={setPushExec} />
          <Toggle label="Push · headline news"      description="Macro headlines that may move risk assets."    checked={pushNews}    onChange={setPushNews} />
          <Toggle label="Price alerts"              description="Notify when a watchlist symbol hits a target." checked={pushAlerts}  onChange={setPushAlerts} />
        </div>
      </Card>

      {/* ── 4. Trading Defaults ─────────────────────── */}
      <Card className="space-y-5">
        <SectionHeader icon={SlidersHorizontal} title="Trading Defaults" description="Pre-set values for the order ticket." />

        <div className="space-y-3">
          <Toggle label="Mock trading mode"      description="No real orders sent — uses simulated OMS responses." checked={mockTrading}   onChange={setMockTrading} />
          <Toggle label="Confirm before submit"  description="Extra modal on large notional trades."               checked={confirmOrders} onChange={setConfirmOrders} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow label="Default leverage">
            <select value={defaultLeverage} onChange={(e) => setDefaultLeverage(e.target.value)} className={inputCls}>
              {['1', '2', '3', '5', '10', '20'].map((x) => <option key={x} value={x}>{x}x</option>)}
            </select>
          </FieldRow>
          <FieldRow label="Default quantity">
            <input value={defaultQty} onChange={(e) => setDefaultQty(e.target.value)} className={inputCls} placeholder="0.10" />
          </FieldRow>
          <FieldRow label="Default order type">
            <select className={inputCls}>
              <option>MARKET</option>
              <option>LIMIT</option>
              <option>STOP_LIMIT</option>
            </select>
          </FieldRow>
          <FieldRow label="Default time in force">
            <select className={inputCls}>
              <option>GTC</option>
              <option>IOC</option>
              <option>FOK</option>
            </select>
          </FieldRow>
        </div>
      </Card>

      {/* ── 5. Security ─────────────────────────────── */}
      <Card className="space-y-5">
        <SectionHeader icon={Shield} title="Security" description="Protect your account with 2FA and withdrawal rules." />

        <div className="space-y-3">
          <Toggle label="Two-factor authentication"  description="Recommended for live keys (mock toggle only)." checked={twoFa}          onChange={setTwoFa} />
          <Toggle label="Withdrawal whitelist lock"   description="Require email to add new addresses."           checked={withdrawalLock} onChange={setWithdrawalLock} />
          <Toggle label="IP whitelist"                description="Restrict logins to approved IP ranges."        checked={ipWhitelist}   onChange={setIpWhitelist} />
        </div>

        <div className="rounded-xl border border-[var(--border-color)] bg-black/10 p-4">
          <p className="text-sm font-semibold">Active sessions</p>
          <div className="mt-3 space-y-2 text-xs text-[var(--text-secondary)]">
            {[
              { loc: 'Mumbai, India', device: 'Chrome · macOS', active: true },
              { loc: 'Singapore', device: 'Safari · iPhone', active: false },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-black/10 px-3 py-2">
                <div>
                  <span className="font-medium text-[var(--text-primary)]">{s.loc}</span>
                  <span className="ml-2 text-[var(--text-secondary)]">· {s.device}</span>
                </div>
                {s.active
                  ? <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-green-400">Current</span>
                  : <button type="button" className="rounded-lg border border-red-500/30 px-2 py-0.5 text-red-400 hover:bg-red-500/10 transition">Revoke</button>
                }
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── 6. Billing ──────────────────────────────── */}
      <Card className="space-y-5">
        <SectionHeader icon={CreditCard} title="Billing" description="Manage your subscription and payment methods." />

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-4">
          <div>
            <p className="font-semibold text-cyan-300">Pro Plan</p>
            <p className="text-sm text-[var(--text-secondary)]">$29 / month · Advanced widgets, lower latency.</p>
          </div>
          <span className="rounded-full bg-green-500/15 px-3 py-1 text-sm font-medium text-green-400">Active</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: 'Next billing date', value: 'May 19, 2026' },
            { label: 'Payment method',   value: 'Visa ····4242' },
            { label: 'Member since',     value: 'January 2024' },
            { label: 'Plan type',        value: 'Monthly' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-[var(--border-color)] bg-black/10 px-4 py-3">
              <p className="text-xs text-[var(--text-secondary)]">{item.label}</p>
              <p className="mt-0.5 font-medium">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black hover:bg-cyan-400 transition active:scale-95">
            Manage billing
          </button>
          <button type="button" className="rounded-xl border border-[var(--border-color)] px-4 py-2 text-sm hover:bg-white/5 transition">
            Download invoice
          </button>
        </div>
      </Card>

      {/* ── 7. API Keys ─────────────────────────────── */}
      <Card className="space-y-5">
        <SectionHeader icon={KeyRound} title="API Keys" description="Keys are stored in local state only — do not paste production secrets." />

        <div className="space-y-4">
          <FieldRow label="API key">
            <input
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setTestStatus(null) }}
              className={inputCls + ' font-mono'}
              placeholder="pk_live_..."
            />
          </FieldRow>

          <FieldRow label="API secret">
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                value={apiSecret}
                onChange={(e) => { setApiSecret(e.target.value); setTestStatus(null) }}
                className={inputCls + ' font-mono pr-10'}
                placeholder="sk_live_..."
              />
              <button
                type="button"
                onClick={() => setShowSecret((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
              >
                {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FieldRow>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testStatus === 'loading'}
            className="rounded-xl bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/25 disabled:opacity-50 active:scale-95"
          >
            {testStatus === 'loading' ? 'Testing…' : 'Test connection'}
          </button>
          <button type="button" className="rounded-xl border border-[var(--border-color)] px-4 py-2 text-sm hover:bg-white/5 transition">
            Rotate keys
          </button>
          {testStatus === 'success' && (
            <span className="flex items-center gap-1 text-sm text-green-400">
              <Check size={14} /> Connected
            </span>
          )}
          {testStatus === 'error' && (
            <span className="text-sm text-red-400">Connection failed — check your key.</span>
          )}
        </div>

        <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-300">
          ⚠ Never share or paste real API secrets into browser-based apps. This field is for demo purposes only.
        </p>
      </Card>
    </div>
  )
}

export default SettingsPage
