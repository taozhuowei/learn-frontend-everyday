/**
 * Component: CodeBlock
 * Purpose: Render highlighted source code blocks for generated answers and other standalone snippets.
 * Data flow: Accept raw code and source type from the parent, normalize the language, then delegate rendering to the shared syntax highlighter.
 */

import { SyntaxHighlighter, oneLight } from '../utils/code_highlighter'

const HIGHLIGHT_LANGUAGE_MAP: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  jsx: 'jsx',
  tsx: 'tsx',
  vue: 'html',
  html: 'html',
}

export function CodeBlock({ code, language }: { code: string; language?: string }) {
  const resolved_language = HIGHLIGHT_LANGUAGE_MAP[language ?? ''] ?? language ?? 'javascript'

  return (
    <SyntaxHighlighter
      customStyle={{
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        fontSize: 13,
        margin: 0,
        padding: '1rem',
      }}
      language={resolved_language}
      style={oneLight}
      wrapLongLines
    >
      {code.trimEnd()}
    </SyntaxHighlighter>
  )
}
