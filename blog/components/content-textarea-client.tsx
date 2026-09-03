'use client'

import { useRef, useState } from 'react'
import { ImageUpload } from './image-upload'
import { Bold, Italic, Link as LinkIcon, Heading1, Heading2, List, Code, Quote } from 'lucide-react'

interface ContentTextareaClientProps {
  defaultValue?: string
}

export function ContentTextareaClient({ defaultValue }: ContentTextareaClientProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [wordCount, setWordCount] = useState(
    defaultValue ? (defaultValue.trim() ? defaultValue.trim().split(/\s+/).length : 0) : 0
  )
  const [charCount, setCharCount] = useState(defaultValue?.length || 0)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    const event = new CustomEvent<string>('content-change', { detail: text })
    window.dispatchEvent(event)
    
    // Update counts
    setCharCount(text.length)
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0)
  }

  const handleImageInsert = (imageUrl: string) => {
    if (!textareaRef.current) return
    
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const imageMarkdown = `
![Image](${imageUrl})
`
    
    const newText = text.substring(0, start) + imageMarkdown + text.substring(end)
    textarea.value = newText
    textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length
    textarea.focus()
    
    // Trigger the change event
    handleChange({ target: textarea } as React.ChangeEvent<HTMLTextAreaElement>)
  }

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return
    
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selectedText = text.substring(start, end)
    
    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end)
    textarea.value = newText
    textarea.selectionStart = start + prefix.length
    textarea.selectionEnd = start + prefix.length + selectedText.length
    textarea.focus()
    
    // Trigger the change event
    handleChange({ target: textarea } as React.ChangeEvent<HTMLTextAreaElement>)
  }

  const formatBold = () => insertMarkdown('**', '**')
  const formatItalic = () => insertMarkdown('*', '*')
  const formatLink = () => insertMarkdown('[', '](url)')
  const formatH1 = () => insertMarkdown('# ', '')
  const formatH2 = () => insertMarkdown('## ', '')
  const formatList = () => insertMarkdown('- ', '')
  const formatCode = () => insertMarkdown('`', '`')
  const formatQuote = () => insertMarkdown('> ', '')

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2 relative">
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={formatBold}
            className="bevel-out px-2 py-1 font-bold text-black text-xs"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={formatItalic}
            className="bevel-out px-2 py-1 font-bold text-black text-xs"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={formatLink}
            className="bevel-out px-2 py-1 font-bold text-black text-xs"
            title="Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={formatH1}
            className="bevel-out px-2 py-1 font-bold text-black text-xs"
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={formatH2}
            className="bevel-out px-2 py-1 font-bold text-black text-xs"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={formatList}
            className="bevel-out px-2 py-1 font-bold text-black text-xs"
            title="List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={formatCode}
            className="bevel-out px-2 py-1 font-bold text-black text-xs"
            title="Code"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={formatQuote}
            className="bevel-out px-2 py-1 font-bold text-black text-xs"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-black">
            {wordCount} words
          </div>
          <div className="text-xs font-mono text-black">
            {charCount} chars
          </div>
          <ImageUpload onImageInsert={handleImageInsert} />
        </div>
      </div>
      <textarea
        ref={textareaRef}
        id="content"
        name="content"
        defaultValue={defaultValue}
        required
        rows={20}
        className="bevel-in w-full px-2 py-1 font-mono text-black"
        onChange={handleChange}
      />
    </div>
  )
}
