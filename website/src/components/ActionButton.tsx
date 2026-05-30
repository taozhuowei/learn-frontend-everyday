/**
 * Component: ActionButton
 * Purpose: 题目工作区的执行按钮（运行 / 提交），纯展示、受控、无业务状态。
 * 预留固定 min-width 容纳进行中文案，切换文字时尺寸恒定，避免布局跳变。
 */

import type { ReactNode } from 'react'

type ActionButtonVariant = 'primary' | 'secondary'

interface ActionButtonProps {
  variant: ActionButtonVariant
  icon: ReactNode
  /** 空闲态文案 */
  label: string
  /** 进行中文案 */
  pendingLabel: string
  /** 是否处于进行中 */
  pending: boolean
  disabled?: boolean
  onClick: () => void
  title?: string
  testId?: string
}

const VARIANT_CLASS: Record<ActionButtonVariant, string> = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)]',
  secondary:
    'bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-primary)]',
}

export function ActionButton({
  variant,
  icon,
  label,
  pendingLabel,
  pending,
  disabled = false,
  onClick,
  title,
  testId,
}: ActionButtonProps) {
  return (
    <button
      className={`flex-1 flex items-center justify-center gap-1 min-w-[5.5rem] px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${VARIANT_CLASS[variant]}`}
      disabled={disabled}
      onClick={onClick}
      title={title}
      type="button"
      data-testid={testId}
    >
      {icon}
      {pending ? pendingLabel : label}
    </button>
  )
}
