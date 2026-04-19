import { motion } from 'framer-motion'

/**
 * Component: LoadingPanel
 * Purpose: Provide a unified loading placeholder for route-level and editor-level lazy imports.
 * Data flow: Receive an optional message from the parent suspense boundary and render a centered status panel.
 */

export function LoadingPanel({
  className = 'h-full',
  message = 'Loading...',
  type = 'spinner',
}: {
  className?: string
  message?: string
  type?: 'spinner' | 'skeleton' | 'code'
}) {
  if (type === 'code') {
    return (
      <div
        className={`${className} flex flex-col bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden`}
      >
        <div className="h-12 border-b border-[var(--color-border)] flex items-center px-4 bg-[var(--color-surface)]">
          <div className="h-4 w-32 bg-[var(--color-border)] rounded animate-pulse" />
        </div>
        <div className="flex-1 p-6 flex flex-col gap-4 bg-[var(--color-surface-secondary)]">
          <div className="h-4 w-3/4 bg-[var(--color-border)] rounded animate-pulse opacity-50" />
          <div className="h-4 w-1/2 bg-[var(--color-border)] rounded animate-pulse opacity-40" />
          <div className="h-4 w-5/6 bg-[var(--color-border)] rounded animate-pulse opacity-30" />
          <div className="h-4 w-1/3 bg-[var(--color-border)] rounded animate-pulse opacity-20" />
        </div>
      </div>
    )
  }

  if (type === 'skeleton') {
    return (
      <div
        className={`${className} p-6 flex flex-col gap-4 bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)]`}
      >
        <div className="h-6 w-1/3 bg-[var(--color-border)] rounded animate-pulse" />
        <div className="h-4 w-full bg-[var(--color-border)] rounded animate-pulse opacity-60 mt-4" />
        <div className="h-4 w-5/6 bg-[var(--color-border)] rounded animate-pulse opacity-50" />
        <div className="h-4 w-4/6 bg-[var(--color-border)] rounded animate-pulse opacity-40" />
      </div>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      aria-live="polite"
      className={`${className} flex items-center justify-center bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)]`}
      role="status"
    >
      <div className="flex flex-col items-center gap-3 px-6 py-5">
        <span
          aria-hidden="true"
          className="size-6 rounded-full border-[3px] border-[var(--color-border)] border-t-[var(--color-primary)] animate-spin"
        />
        <p className="text-sm font-medium text-[var(--color-ink-muted)] m-0">{message}</p>
      </div>
    </motion.section>
  )
}
