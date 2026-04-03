/**
 * Component: LoadingPanel
 * Purpose: Provide a unified loading placeholder for route-level and editor-level lazy imports.
 * Data flow: Receive an optional message from the parent suspense boundary and render a centered status panel.
 */

export function LoadingPanel({
  className = 'h-full',
  message = 'Loading...',
}: {
  className?: string
  message?: string
}) {
  return (
    <section
      aria-live="polite"
      className={`${className} flex items-center justify-center bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)]`}
      role="status"
    >
      <div className="flex flex-col items-center gap-2 px-6 py-5">
        <span
          aria-hidden="true"
          className="size-5 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)] animate-spin"
        />
        <p className="text-sm font-semibold text-[var(--color-ink-muted)] m-0">{message}</p>
      </div>
    </section>
  )
}
