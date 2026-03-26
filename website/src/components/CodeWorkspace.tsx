import { useEffect, useRef } from 'react'
import Editor, { type BeforeMount, type OnMount } from '@monaco-editor/react'
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

  const handleBeforeMount: BeforeMount = (monacoInstance) => {
    monacoInstance.editor.defineTheme('atelier-claude-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '8A8378', fontStyle: 'italic' },
        { token: 'keyword', foreground: '2B63F3' },
        { token: 'operator', foreground: '5B5348' },
        { token: 'number', foreground: 'C96A32' },
        { token: 'string', foreground: '1E7C63' },
        { token: 'regexp', foreground: '8A4CE3' },
        { token: 'type', foreground: '7A3A17' },
        { token: 'identifier', foreground: '1F2430' },
        { token: 'delimiter', foreground: '625C54' },
      ],
      colors: {
        'editor.background': '#FBF8F2',
        'editor.foreground': '#1F2430',
        'editor.lineHighlightBackground': '#F2ECE1',
        'editor.lineHighlightBorder': '#00000000',
        'editor.selectionBackground': '#DCE7FF',
        'editor.selectionHighlightBackground': '#EAF0FF',
        'editor.wordHighlightBackground': '#EAF0FF',
        'editor.wordHighlightStrongBackground': '#D8E4FF',
        'editorCursor.foreground': '#2549B8',
        'editorWhitespace.foreground': '#D5CCBC',
        'editorIndentGuide.background1': '#E4DCCF',
        'editorIndentGuide.activeBackground1': '#C3B7A3',
        'editorLineNumber.foreground': '#A39A8C',
        'editorLineNumber.activeForeground': '#4B4339',
        'editorGutter.background': '#FBF8F2',
        'editorBracketMatch.background': '#EEF3FF',
        'editorBracketMatch.border': '#A9BFFB',
        'editorWidget.background': '#FFFDFC',
        'editorWidget.border': '#DDD3C5',
        'editorSuggestWidget.background': '#FFFDFC',
        'editorSuggestWidget.border': '#DDD3C5',
        'editorSuggestWidget.selectedBackground': '#EEF3FF',
        'editorHoverWidget.background': '#FFFDFC',
        'editorHoverWidget.border': '#DDD3C5',
        'scrollbarSlider.background': '#CFC5B633',
        'scrollbarSlider.hoverBackground': '#CFC5B366',
        'scrollbarSlider.activeBackground': '#CFC5B399',
      },
    })
  }

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
          beforeMount={handleBeforeMount}
          height="100%"
          language={language}
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
            bracketPairColorization: {
              enabled: true,
            },
            suggestOnTriggerCharacters: true,
            scrollbar: {
              verticalScrollbarSize: 9,
              horizontalScrollbarSize: 9,
            },
            wordWrap: 'on',
          }}
          theme="atelier-claude-light"
          value={value}
        />
      </div>

      {footer ? <div className="workspace-footer">{footer}</div> : null}
    </section>
  )
}
