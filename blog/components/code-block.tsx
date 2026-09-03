'use client'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language = 'javascript', className = '' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`retro-code-block relative ${className}`}>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors z-10"
        title={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          background: '#1e1e1e',
          padding: '0.75rem',
          paddingTop: '2.5rem',
          borderRadius: '0',
          fontSize: '0.8rem',
          lineHeight: '1.4',
          margin: '0',
          maxHeight: '300px',
          overflow: 'auto',
        }}
        codeTagProps={{
          style: {
            fontSize: '0.8rem',
            fontFamily: '"Courier New", Courier, monospace',
          }
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
