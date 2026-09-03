'use client'

import { useState, useEffect } from 'react'
import { markdownToHtml } from '@/lib/markdown'

interface EditorPreviewProps {
  content: string
  className?: string
}

export function EditorPreview({ content, className = '' }: EditorPreviewProps) {
  const [htmlContent, setHtmlContent] = useState('')
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    if (content) {
      setHtmlContent(markdownToHtml(content))
    }
  }, [content])

  if (!isPreviewMode) {
    return (
      <button
        type="button"
        onClick={() => setIsPreviewMode(true)}
        className={`btn3d px-3 py-1 text-xs font-bold ${className}`}
      >
        [ Preview ]
      </button>
    )
  }

  return (
    <div className={`frame bg-content-alt p-3 mt-3 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-accent">Live Preview</span>
        <button
          type="button"
          onClick={() => setIsPreviewMode(false)}
          className="btn3d px-2 py-0.5 text-xs font-bold"
        >
          [ Close ]
        </button>
      </div>
      <div 
        className="retro-prose text-sm max-h-96 overflow-y-auto"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  )
}
