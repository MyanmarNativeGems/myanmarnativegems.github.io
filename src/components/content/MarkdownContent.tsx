import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '../../lib/utils'

function heading(level: 2 | 3) {
  const Tag = `h${level}` as const
  const classes =
    level === 2
      ? 'mt-12 font-serif text-2xl font-medium md:text-3xl'
      : 'mt-8 font-serif text-xl font-medium'
  return ({ children }: { children?: ReactNode }) => (
    <Tag className={classes}>{children}</Tag>
  )
}

/**
 * Editorial Markdown renderer. Styled like a publication, not a README:
 * serif headings, readable measure, generous rhythm.
 */
export function MarkdownContent({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'max-w-[70ch] text-[1.0625rem] leading-relaxed',
        '[&>p:first-of-type]:text-lg',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: heading(2),
          h2: heading(2),
          h3: heading(3),
          p: ({ children }) => <p className="mt-5">{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="underline decoration-gold underline-offset-4 transition-colors duration-200 hover:text-ruby"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="mt-5 list-disc space-y-2 pl-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-5 list-decimal space-y-2 pl-5">{children}</ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mt-6 border-l-2 border-gold pl-5 font-serif text-xl italic leading-[1.4] text-ink-soft">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-line py-2 pr-6 text-left font-medium">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-line py-2 pr-6 align-top text-ink-soft">
              {children}
            </td>
          ),
          img: ({ src, alt }) => (
            <img
              src={typeof src === 'string' ? src : undefined}
              alt={alt ?? ''}
              loading="lazy"
              className="mt-8 w-full"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
