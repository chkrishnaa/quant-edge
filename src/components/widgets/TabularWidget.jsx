import { cn } from '../../utils/cn.js'

export function TabularWidget({ title, subtitle, badge, right, children, className }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-[var(--border-color)] bg-black/15 shadow-inner',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-color)] px-3 py-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-400/90">{title}</p>
            {badge ? (
              <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                {badge}
              </span>
            ) : null}
          </div>
          {subtitle ? <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">{subtitle}</p> : null}
        </div>
        {right}
      </div>
      {children}
    </div>
  )
}

export function TabularWidgetBody({ children, className }) {
  return <div className={cn('overflow-x-auto', className)}>{children}</div>
}

export function ScrollTable({ columns, rows, onRowClick, maxHeight = 'max-h-52', dense, rowKey = 'id' }) {
  return (
    <div className={cn('overflow-y-auto', maxHeight)}>
      <table className={cn('w-full min-w-[480px] text-left', dense ? 'text-[11px]' : 'text-xs')}>
        <thead className="sticky top-0 z-10 bg-[var(--bg-secondary)]/95 backdrop-blur-sm">
          <tr className="text-[var(--text-secondary)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'whitespace-nowrap px-2 py-2 font-semibold',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row[rowKey] ?? idx}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-t border-[var(--border-color)] transition-colors',
                onRowClick && 'cursor-pointer hover:bg-cyan-500/10',
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'px-2 py-1.5',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                  )}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
