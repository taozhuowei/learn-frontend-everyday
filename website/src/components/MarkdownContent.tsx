import ReactMarkdown from 'react-markdown'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { SyntaxHighlighter, oneLight } from '../utils/code_highlighter'

export function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <div className="cf-markdown">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const language = className?.replace('language-', '')
            if (!language) {
              return <code {...props}>{children}</code>
            }

            return (
              <SyntaxHighlighter
                customStyle={{
                  borderRadius: 20,
                  fontSize: 13,
                  margin: '1.2rem 0',
                }}
                language={language}
                style={oneLight}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            )
          },
        }}
        rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'append' }]]}
        remarkPlugins={[remarkGfm]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
