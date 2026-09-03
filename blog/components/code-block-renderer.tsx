'use client'

import { useEffect, useRef, useState } from 'react'
import { codeToHtml } from 'shiki'

interface CodeBlockRendererProps {
  content: string
  className?: string
}

interface CodeBlock {
  id: string
  language: string
  code: string
  highlightedHtml: string
}

export function CodeBlockRenderer({ content, className = '' }: CodeBlockRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const processCodeBlocks = async () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const codeWrappers = container.querySelectorAll('.code-block-wrapper')

      const blocks: CodeBlock[] = []

      for (const wrapper of codeWrappers) {
        const language = wrapper.getAttribute('data-language') || 'javascript'
        const code = wrapper.getAttribute('data-code') || ''
        const id = `code-block-${Math.random().toString(36).substr(2, 9)}`

        // Map language names to Shiki-supported languages
        const languageMap: Record<string, string> = {
          'assembly': 'asm',
          'asm': 'asm',
          'c': 'c',
          'cpp': 'cpp',
          'javascript': 'javascript',
          'typescript': 'typescript',
          'python': 'python',
          'rust': 'rust',
          'go': 'go',
          'java': 'java',
          'bash': 'bash',
          'shell': 'bash',
          'json': 'json',
          'yaml': 'yaml',
          'markdown': 'markdown',
          'html': 'html',
          'css': 'css',
          'sql': 'sql',
          'php': 'php',
          'ruby': 'ruby',
        }

        const mappedLanguage = languageMap[language.toLowerCase()] || language

        try {
          const highlightedHtml = await codeToHtml(code, {
            lang: mappedLanguage,
            theme: 'vitesse-dark'
          })

          blocks.push({ id, language, code, highlightedHtml })
        } catch (error) {
          console.error('Error highlighting code:', error)
          // Fallback to plain code if highlighting fails
          const fallbackHtml = `<pre style="background: #1e1e1e; padding: 1rem; overflow-x: auto;"><code style="font-family: monospace; color: #d4d4d4;">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
          blocks.push({ id, language, code, highlightedHtml: fallbackHtml })
        }

        // Replace the wrapper with a placeholder div
        const placeholder = document.createElement('div')
        placeholder.id = id
        placeholder.className = 'code-block-placeholder'
        wrapper.parentNode?.replaceChild(placeholder, wrapper)
      }

      setCodeBlocks(blocks)
      setIsLoading(false)
    }

    processCodeBlocks()
  }, [content])

  const CodeBlock = ({ language, code, highlightedHtml }: { language: string; code: string; highlightedHtml: string }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    return (
      <div className="my-4" style={{ background: '#1e1e1e', border: '1px solid #3e3e3e', borderRadius: '0' }}>
        <div className="flex items-center justify-between px-4 py-2" style={{ background: '#252526', color: '#d4d4d4', fontSize: '0.875rem', borderBottom: '1px solid #3e3e3e' }}>
          <span className="font-mono">{language}</span>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs transition-colors"
            style={{ background: '#3e3e3e', color: '#d4d4d4', border: 'none', cursor: 'pointer', borderRadius: '0' }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div 
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          style={{ padding: '1rem', overflowX: 'auto', lineHeight: '1.5' }}
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`prose ${className}`}>
        <div ref={containerRef} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    )
  }

  return (
    <div className={`prose ${className}`}>
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: content }} />
      {codeBlocks.map((block) => (
        <div key={block.id}>
          <CodeBlock language={block.language} code={block.code} highlightedHtml={block.highlightedHtml} />
        </div>
      ))}
    </div>
  )
}
