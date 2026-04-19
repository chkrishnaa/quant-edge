import { cn } from '../../utils/cn.js'

function Card({ className, children, onClick }) {
  const isClickable = typeof onClick === 'function'
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border p-4 transition-all duration-200',
        'bg-[var(--card-bg)] border-[var(--border-color)]',
        'backdrop-blur-xl shadow-[var(--card-shadow)]',
        isClickable && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[var(--glow-cyan)] hover:border-cyan-500/25',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default Card
