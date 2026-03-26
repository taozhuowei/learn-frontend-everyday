import { useEffect, useRef } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import type * as monaco from 'monaco-editor'

export interface WorkspaceAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'ghost'
}

export function CodeWorkspace({
  title,
  description,
  language = 'javascript',
  value,
  onChange,
  actions,
  footer,
}: {
  title: string
  description: string
  language?: string
  value: string
  onChange: (value: string) => void
  actions?: WorkspaceAction[]
  footer?: React.ReactNode
}) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const syncingRef = useRef(false)

  useEffect(() => {
    const model = editorRef.current?.getModel()
    if (!model || model.getValue() === value) {
      return
    }

    syncingRef.current = true
    model.setValue(value)
  }, [value])

  const handleMount: OnMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor

    window.__setPracticeEditorValue__ = (nextValue) => {
      const model = editor.getModel()
      if (!model) {
        return
      }

      syncingRef.current = true
      model.setValue(nextValue)
      onChange(nextValue)
    }

    window.__getPracticeEditorValue__ = () => editor.getValue()
    window.__triggerPracticeSuggest__ = () => {
      editor.focus()
      editor.trigger('practice-tests', 'editor.action.triggerSuggest', {})
    }
    window.__isPracticeSuggestVisible__ = () =>
      Boolean(document.querySelector('.suggest-widget.visible'))
  }

  return (
    <section className="panel workspace-panel">
      <div className="panel-heading workspace-heading">
        <div>
          <span className="panel-title">{title}</span>
          <p className="panel-description">{description}</p>
        </div>
        {actions?.length ? (
          <div className="workspace-actions">
            {actions.map((action) => (
              <button
                className={`action-button ${action.variant === 'ghost' ? 'ghost' : 'primary'}`}
                key={action.label}
                onClick={action.onClick}
                type="button"
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="editor-frame editor-frame-leetcode">
        <Editor
          defaultLanguage={language}
          height="100%"
          onChange={(nextValue) => {
            if (syncingRef.current) {
              syncingRef.current = false
              return
            }

            onChange(nextValue ?? '')
          }}
          onMount={handleMount}
          options={{
            acceptSuggestionOnEnter: 'on',
            automaticLayout: true,
            fontFamily: `'IBM Plex Mono', 'Cascadia Code', monospace`,
            fontSize: 13,
            lineHeight: 20,
            lineNumbersMinChars: 3,
            minimap: { enabled: false },
            padding: { top: 14, bottom: 14 },
            quickSuggestions: {
              comments: false,
              other: true,
              strings: false,
            },
            roundedSelection: true,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            renderLineHighlight: 'gutter',
            suggestOnTriggerCharacters: true,
            scrollbar: {
              verticalScrollbarSize: 9,
              horizontalScrollbarSize: 9,
            },
            wordWrap: 'on',
          }}
          theme="vs-light"
          value={value}
        />
      </div>

      {footer ? <div className="workspace-footer">{footer}</div> : null}
    </section>
  )
}
