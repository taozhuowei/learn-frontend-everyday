/**
 * Component: CodeWorkspace
 * Purpose: Monaco 代码编辑器面板，包含题目标题、格式化按钮和编辑器主体。
 * 通过 editorRef 向父组件暴露 getValue()，不使用 window 全局变量。
 */

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react'
import Editor, { type BeforeMount, type OnMount, loader } from '@monaco-editor/react'
import { AlignLeft } from 'lucide-react'
import * as monaco from 'monaco-editor'
import { LoadingPanel } from './LoadingPanel'

loader.config({ monaco })

export interface CodeEditorHandle {
  getValue: () => string
  triggerSuggest: () => void
  isSuggestVisible: () => boolean
}

export interface WorkspaceAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'ghost'
}

const LANGUAGE_MAP: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  jsx: 'javascript',
  tsx: 'typescript',
  vue: 'html',
}

export const CodeWorkspace = forwardRef<
  CodeEditorHandle,
  {
    title: string
    description?: string
    language?: string
    value: string
    onChange: (value: string) => void
    actions?: WorkspaceAction[]
    footer?: React.ReactNode
  }
>(function CodeWorkspace(
  { title, description, language = 'javascript', value, onChange, actions, footer },
  ref,
) {
  const resolvedLanguage = LANGUAGE_MAP[language] ?? language
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<typeof monaco | null>(null)
  const syncingRef = useRef(false)

  useImperativeHandle(ref, () => ({
    getValue: () => editorRef.current?.getValue() ?? '',
    triggerSuggest: () => {
      editorRef.current?.focus()
      editorRef.current?.trigger('practice-tests', 'editor.action.triggerSuggest', {})
    },
    isSuggestVisible: () => Boolean(document.querySelector('.suggest-widget.visible')),
  }))

  useEffect(() => {
    const model = editorRef.current?.getModel()
    if (!model || model.getValue() === value) {
      return
    }

    syncingRef.current = true
    model.setValue(value)
  }, [value])

  const formatCode = useCallback(async () => {
    const editor = editorRef.current
    if (!editor) return

    try {
      await editor.getAction('editor.action.formatDocument')?.run()
    } catch (error) {
      console.warn('Format failed:', error)
    }
  }, [])

  const handlePaste = useCallback(async () => {
    setTimeout(() => {
      formatCode()
    }, 100)
  }, [formatCode])

  const handleBeforeMount: BeforeMount = (monacoInstance) => {
    monacoRef.current = monacoInstance

    monacoInstance.editor.defineTheme('cf-light', {
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

    editor.onDidPaste(() => {
      handlePaste()
    })
  }

  return (
    <section className="flex flex-col h-full bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-[var(--color-border)] shrink-0 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-bold text-[var(--color-ink)] whitespace-nowrap">
            {title}
          </span>
          {description ? (
            <span
              className="text-xs text-[var(--color-ink-tertiary)] truncate max-w-xs"
              title={description}
            >
              {description}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-[var(--color-ink-tertiary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-ink)] transition-colors border border-transparent hover:border-[var(--color-border)]"
            onClick={formatCode}
            title="格式化代码 (Alt+Shift+F)"
            type="button"
          >
            <AlignLeft size={14} />
            格式化
          </button>
          {actions?.map((action) => (
            <button
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                action.variant === 'ghost'
                  ? 'text-[var(--color-ink-tertiary)] hover:bg-[var(--color-surface-secondary)] border border-[var(--color-border)]'
                  : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)]'
              }`}
              key={action.label}
              onClick={action.onClick}
              type="button"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="cf-editor-container relative">
        <Editor
          loading={<LoadingPanel className="absolute inset-0 z-10 w-full h-full" type="code" />}
          beforeMount={handleBeforeMount}
          height="100%"
          language={resolvedLanguage}
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
            bracketPairColorization: { enabled: true },
            suggestOnTriggerCharacters: true,
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
          }}
          theme="cf-light"
          value={value}
        />
      </div>

      {footer ? (
        <div className="shrink-0 border-t border-[var(--color-border)]">{footer}</div>
      ) : null}
    </section>
  )
})
