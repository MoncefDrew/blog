'use client'

import { useEffect, useRef } from 'react'
import { CodeBlock } from './code-block'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const codeWrappers = container.querySelectorAll('.code-block-wrapper')

    codeWrappers.forEach((wrapper) => {
      const language = wrapper.getAttribute('data-language') || 'javascript'
      const code = wrapper.textContent || ''

      // Replace the wrapper with the CodeBlock component
      const codeBlockContainer = document.createElement('div')
      wrapper.parentNode?.replaceChild(codeBlockContainer, wrapper)

      // Create a React root for the CodeBlock
      // We'll use a simpler approach by just rendering HTML
      codeBlockContainer.innerHTML = `
        <div class="retro-code-block">
          <pre class="syntax-highlighter" data-language="${language}" style="background: #1e1e1e; padding: 0.5rem; margin: 1rem 0; overflow-x: auto; max-height: 300px; border: 1px solid #808080;">
            <code style="font-family: 'Courier New', monospace; font-size: 0.8rem; line-height: 1.4; color: #d4d4d4;">${escapeHtml(code)}</code>
          </pre>
        </div>
      `
    })
  }, [content])

  const escapeHtml = (text: string) => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  return (
    <div
      ref={containerRef}
      className={`retro-prose ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
