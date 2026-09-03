'use client'

import { useState, useEffect } from 'react'
import { markdownToHtml } from '@/lib/markdown'

interface EditorPreviewClientProps {
  initialContent: string
  children: React.ReactNode
}

export function EditorPreviewClient({ initialContent, children }: EditorPreviewClientProps) {
  const [htmlContent, setHtmlContent] = useState('')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [currentContent, setCurrentContent] = useState(initialContent)

  useEffect(() => {
    setHtmlContent(markdownToHtml(currentContent))
  }, [currentContent])

  useEffect(() => {
    const handleContentChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      setCurrentContent(customEvent.detail)
    }

    window.addEventListener('content-change', handleContentChange as EventListener)
    return () => window.removeEventListener('content-change', handleContentChange as EventListener)
  }, [])

  // Listen for the preview toggle event
  useEffect(() => {
    const handleTogglePreview = () => {
      setIsPreviewMode(prev => !prev)
    }

    window.addEventListener('toggle-preview', handleTogglePreview)
    return () => window.removeEventListener('toggle-preview', handleTogglePreview)
  }, [])

  return (
    <>
      {children}
      {isPreviewMode && (
        <div className="frame bg-content-alt p-3 mt-3">
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
      )}
      <button
        type="button"
        onClick={() => setIsPreviewMode(!isPreviewMode)}
        className="btn3d px-3 py-1 text-xs font-bold mt-2"
      >
        {isPreviewMode ? '[ Hide Preview ]' : '[ Show Preview ]'}
      </button>
    </>
  )
}
