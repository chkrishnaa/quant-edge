import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn.js'

function Modal({ open, onClose, title, subtitle, children, className, wide }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4" role="presentation">
      <motion.button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative z-[61] mb-0 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-[var(--card-shadow)] backdrop-blur-xl sm:mb-auto sm:rounded-2xl',
          wide ? 'max-w-4xl' : 'max-w-lg',
          className,
        )}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border-color)] px-4 py-3">
          <div className="min-w-0">
            <h2 id="modal-title" className="truncate text-base font-semibold text-[var(--text-primary)]">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-[var(--border-color)] p-1.5 text-[var(--text-secondary)] transition hover:bg-white/5 hover:text-[var(--text-primary)]"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto p-4">{children}</div>
      </motion.div>
    </div>,
    document.body,
  )
}

export default Modal
