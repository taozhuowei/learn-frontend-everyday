import { useMemo, useState } from 'react'
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
      <button
        aria-label="关闭配置面板"
        className="drawer-backdrop"
        onClick={closeSettingsPanel}
        type="button"
      />
      <aside aria-label="配置抽屉" className="settings-drawer">
        <div className="drawer-header">
          <div>
            <span className="panel-caption">配置</span>
            <h2>考试规则</h2>
          </div>
          <button
            aria-label="关闭配置面板"
            className="icon-button"
            onClick={closeSettingsPanel}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <section className="drawer-body">
          <label className="field">
            <span>考试时长（分钟）</span>
            <input
              min={5}
              onChange={(event) =>
                setForm((current) => ({ ...current, durationMinutes: Number(event.target.value) }))
              }
              type="number"
              value={form.durationMinutes}
            />
          </label>

          <label className="field">
            <span>题目数量</span>
            <input
              min={1}
              onChange={(event) =>
                setForm((current) => ({ ...current, questionCount: Number(event.target.value) }))
              }
              type="number"
              value={form.questionCount}
            />
          </label>

          <label className="field">
            <span>及格线</span>
            <input
              max={100}
              min={1}
              onChange={(event) =>
                setForm((current) => ({ ...current, passingScore: Number(event.target.value) }))
              }
              type="number"
              value={form.passingScore}
            />
          </label>

          <fieldset className="field fieldset">
            <legend>考试范围</legend>
            <div className="chip-group">
              {categories.map((category) => {
                const selected = form.categoryIds.includes(category.id)

                return (
                  <button
                    className={`chip ${selected ? 'active' : ''}`}
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
        </section>

        <div className="drawer-footer">
          <button
            className="action-button primary"
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
            className="action-button ghost"
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
