import { SyntaxHighlighter, oneLight } from '../utils/code_highlighter'

export function CodePreview({
  code,
  language = 'javascript',
  className,
}: {
  code: string
  language?: string
  className?: string
}) {
  return (
    <div className={className}>
      <SyntaxHighlighter
        customStyle={{
          margin: 0,
          padding: '0.9rem',
          borderRadius: 14,
          fontSize: 12.5,
          lineHeight: 1.6,
        }}
        language={language}
        showLineNumbers
        style={oneLight}
        wrapLongLines
      >
        {code.trimEnd()}
      </SyntaxHighlighter>
    </div>
  )
}
