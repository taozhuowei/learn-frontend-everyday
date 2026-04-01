import { useEffect, useRef, useCallback } from 'react'
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
  const monacoRef = useRef<typeof monaco | null>(null)
  const syncingRef = useRef(false)

  useEffect(() => {
    const model = editorRef.current?.getModel()
    if (!model || model.getValue() === value) {
      return
    }

    syncingRef.current = true
    model.setValue(value)
  }, [value])

  // 格式化代码函数
  const formatCode = useCallback(async () => {
    const editor = editorRef.current
    if (!editor) return

    try {
      await editor.getAction('editor.action.formatDocument')?.run()
    } catch (error) {
      console.warn('Format failed:', error)
    }
  }, [])

  // 粘贴时自动格式化
  const handlePaste = useCallback(async () => {
    // 延迟执行格式化，等待粘贴完成
    setTimeout(() => {
      formatCode()
    }, 100)
  }, [formatCode])

  const handleBeforeMount: BeforeMount = (monacoInstance) => {
    monacoRef.current = monacoInstance

    // 定义 LeetCode 风格的浅色主题
    monacoInstance.editor.defineTheme('leetcode-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: '2563EB', fontStyle: 'bold' },
        { token: 'operator', foreground: '374151' },
        { token: 'number', foreground: 'DC2626' },
        { token: 'string', foreground: '059669' },
        { token: 'regexp', foreground: '7C3AED' },
        { token: 'type', foreground: 'D97706', fontStyle: 'bold' },
        { token: 'identifier', foreground: '1F2937' },
        { token: 'delimiter', foreground: '4B5563' },
        { token: 'function', foreground: '2563EB' },
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#1F2937',
        'editor.lineHighlightBackground': '#F3F4F6',
        'editor.lineHighlightBorder': '#00000000',
        'editor.selectionBackground': '#DBEAFE',
        'editor.selectionHighlightBackground': '#EFF6FF',
        'editor.wordHighlightBackground': '#EFF6FF',
        'editor.wordHighlightStrongBackground': '#DBEAFE',
        'editorCursor.foreground': '#2563EB',
        'editorWhitespace.foreground': '#D1D5DB',
        'editorIndentGuide.background1': '#E5E7EB',
        'editorIndentGuide.activeBackground1': '#9CA3AF',
        'editorLineNumber.foreground': '#9CA3AF',
        'editorLineNumber.activeForeground': '#4B5563',
        'editorGutter.background': '#FFFFFF',
        'editorBracketMatch.background': '#EFF6FF',
        'editorBracketMatch.border': '#93C5FD',
        'editorWidget.background': '#FFFFFF',
        'editorWidget.border': '#E5E7EB',
        'editorSuggestWidget.background': '#FFFFFF',
        'editorSuggestWidget.border': '#E5E7EB',
        'editorSuggestWidget.selectedBackground': '#DBEAFE',
        'editorHoverWidget.background': '#FFFFFF',
        'editorHoverWidget.border': '#E5E7EB',
        'scrollbarSlider.background': '#D1D5DB66',
        'scrollbarSlider.hoverBackground': '#9CA3AF66',
        'scrollbarSlider.activeBackground': '#6B728066',
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

    // 添加粘贴事件监听
    editor.onDidPaste(() => {
      handlePaste()
    })
  }

  return (
    <section className="lc-panel lc-workspace-panel">
      <div className="lc-panel-header lc-workspace-header">
        <div className="lc-panel-header-left">
          <span className="lc-panel-title">{title}</span>
          <span className="lc-panel-subtitle">{description}</span>
        </div>
        <div className="lc-workspace-actions">
          <button
            className="lc-btn lc-btn-ghost lc-btn-sm"
            onClick={formatCode}
            title="格式化代码 (Alt+Shift+F)"
            type="button"
          >
            <svg className="lc-icon" fill="none" height="16" viewBox="0 0 24 24" width="16">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
            格式化
          </button>
          {actions?.map((action) => (
            <button
              className={`lc-btn ${action.variant === 'ghost' ? 'lc-btn-ghost' : 'lc-btn-primary'} lc-btn-sm`}
              key={action.label}
              onClick={action.onClick}
              type="button"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lc-editor-container">
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
            fontFamily: `'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace`,
            fontSize: 14,
            lineHeight: 22,
            lineNumbersMinChars: 3,
            minimap: { enabled: false },
            padding: { top: 16, bottom: 16 },
            quickSuggestions: {
              comments: false,
              other: true,
              strings: false,
            },
            roundedSelection: true,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            renderLineHighlight: 'line',
            bracketPairColorization: {
              enabled: true,
            },
            suggestOnTriggerCharacters: true,
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
          }}
          theme="leetcode-light"
          value={value}
        />
      </div>

      {footer ? <div className="lc-workspace-footer">{footer}</div> : null}
    </section>
  )
}
