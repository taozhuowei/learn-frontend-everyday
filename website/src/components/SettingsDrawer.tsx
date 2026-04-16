/**
 * Component: SettingsDrawer
 * Purpose: 考试配置抽屉，从右侧滑入，配置时长/题目数/及格线/分类。
 */

import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { useAppState } from '../context/AppStateContext'

export function SettingsDrawer() {
  const { categories, closeSettingsPanel, state, updateSettings } = useAppState()
  const [form, setForm] = useState(state.settings)

  const canSave = useMemo(
    () =>
      form.durationMinutes > 0 &&
      form.questionCount > 0 &&
      form.passingScore > 0 &&
      form.passingScore <= 100,
    [form],
  )

  return (
    <>
      {/* 遮罩层 */}
      <button
        aria-label="关闭配置面板"
        className="fixed inset-0 bg-black/20 z-40 cursor-default"
        onClick={closeSettingsPanel}
        type="button"
      />

      {/* 抽屉主体 */}
      <aside
        aria-label="配置抽屉"
        className="fixed right-0 top-0 bottom-0 w-full sm:w-80 bg-white border-l border-[var(--color-border)] shadow-xl z-50 flex flex-col transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] shrink-0">
          <div>
            <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-[var(--color-primary-ink)] block mb-0.5">
              配置
            </span>
            <h2 className="text-base font-bold text-[var(--color-ink)]">考试规则</h2>
          </div>
          <button
            aria-label="关闭配置面板"
            className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--color-ink-tertiary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-ink)] transition-colors"
            onClick={closeSettingsPanel}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-[var(--color-ink-secondary)]">
              考试时长（分钟）
            </span>
            <input
              className="px-3 py-2 rounded-md border border-[var(--color-border)] text-sm bg-white focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.12)] transition-all"
              min={5}
              onChange={(event) =>
                setForm((current) => ({ ...current, durationMinutes: Number(event.target.value) }))
              }
              type="number"
              value={form.durationMinutes}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-[var(--color-ink-secondary)]">
              题目数量
            </span>
            <input
              className="px-3 py-2 rounded-md border border-[var(--color-border)] text-sm bg-white focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.12)] transition-all"
              min={1}
              onChange={(event) =>
                setForm((current) => ({ ...current, questionCount: Number(event.target.value) }))
              }
              type="number"
              value={form.questionCount}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-[var(--color-ink-secondary)]">
              及格线（1-100）
            </span>
            <input
              className="px-3 py-2 rounded-md border border-[var(--color-border)] text-sm bg-white focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_rgba(245,158,11,0.12)] transition-all"
              max={100}
              min={1}
              onChange={(event) =>
                setForm((current) => ({ ...current, passingScore: Number(event.target.value) }))
              }
              type="number"
              value={form.passingScore}
            />
          </label>

          <fieldset className="border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 pb-3">
            <legend className="text-sm font-semibold text-[var(--color-ink-secondary)] px-1">
              考试范围
            </legend>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {categories.map((category) => {
                const selected = form.categoryIds.includes(category.id)
                return (
                  <button
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                      selected
                        ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                        : 'bg-white border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-primary)]'
                    }`}
                    key={category.id}
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        categoryIds: selected
                          ? current.categoryIds.filter((item) => item !== category.id)
                          : [...current.categoryIds, category.id],
                      }))
                    }
                    type="button"
                  >
                    {category.label}
                  </button>
                )
              })}
            </div>
          </fieldset>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 px-5 py-4 border-t border-[var(--color-border)] shrink-0">
          <button
            className="w-full py-2 rounded-md bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-strong)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!canSave}
            onClick={() => {
              updateSettings(form)
              closeSettingsPanel()
            }}
            type="button"
          >
            应用配置
          </button>
          <button
            className="w-full py-2 rounded-md bg-transparent text-[var(--color-ink-secondary)] text-sm font-semibold hover:bg-[var(--color-surface-secondary)] transition-colors border border-[var(--color-border)]"
            onClick={() => {
              setForm(state.settings)
            }}
            type="button"
          >
            恢复当前配置
          </button>
        </div>
      </aside>
    </>
  )
}
