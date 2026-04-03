/**
 * Component: CodeBlock
 * Purpose: Render highlighted source code blocks for generated answers and other standalone snippets.
 * Data flow: Accept raw code and source type from the parent, normalize the language, and optionally enable drag-to-pan browsing.
 */

import { useEffect, useRef, useState } from 'react'
import { SyntaxHighlighter, oneLight } from '../utils/code_highlighter'

const HIGHLIGHT_LANGUAGE_MAP: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  jsx: 'jsx',
  tsx: 'tsx',
  vue: 'html',
  html: 'html',
}

export type CodeBlockInteractionMode = 'pan' | 'select'

export function CodeBlock({
  code,
  language,
  interactionMode,
}: {
  code: string
  language?: string
  interactionMode?: CodeBlockInteractionMode
}) {
  const resolved_language = HIGHLIGHT_LANGUAGE_MAP[language ?? ''] ?? language ?? 'javascript'
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef<{ startX: number; startScrollLeft: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const isPanMode = interactionMode === 'pan'

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      if (!isPanMode || !dragStateRef.current || !scrollContainerRef.current) return

      event.preventDefault()
      const deltaX = event.clientX - dragStateRef.current.startX
      scrollContainerRef.current.scrollLeft = dragStateRef.current.startScrollLeft - deltaX
    }

    function stopDragging() {
      if (!dragStateRef.current) return

      dragStateRef.current = null
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', stopDragging)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', stopDragging)
    }
  }, [isPanMode])

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (!isPanMode || !scrollContainerRef.current) return

    dragStateRef.current = {
      startX: event.clientX,
      startScrollLeft: scrollContainerRef.current.scrollLeft,
    }
    setIsDragging(true)
  }

  return (
    <div
      className={`overflow-x-auto rounded-[16px] border border-[var(--color-border)] bg-white ${
        isPanMode ? (isDragging ? 'cursor-grabbing select-none' : 'cursor-grab select-none') : ''
      }`}
      onDragStart={(event) => {
        if (isPanMode) event.preventDefault()
      }}
      onMouseDown={handleMouseDown}
      ref={scrollContainerRef}
      style={{ userSelect: isPanMode ? 'none' : 'text' }}
    >
      <SyntaxHighlighter
        customStyle={{
          border: 'none',
          borderRadius: 0,
          fontSize: 13,
          margin: 0,
          minWidth: '100%',
          padding: '1rem',
          width: 'max-content',
        }}
        language={resolved_language}
        style={oneLight}
        wrapLongLines={interactionMode === undefined}
      >
        {code.trimEnd()}
      </SyntaxHighlighter>
    </div>
  )
}
