'use client'

import { useEffect } from 'react'

export function CodeBlockHandler() {
  useEffect(() => {
    const handleCopy = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('copy-code-btn')) {
        const encodedCode = target.getAttribute('data-code')
        if (encodedCode) {
          // Decode HTML entities
          const textArea = document.createElement('textarea')
          textArea.innerHTML = encodedCode
          const code = textArea.value
          
          navigator.clipboard.writeText(code).then(() => {
            const originalText = target.textContent
            target.textContent = 'Copied!'
            target.style.background = '#50fa7b'
            target.style.color = '#1e1e1e'
            
            setTimeout(() => {
              target.textContent = originalText
              target.style.background = '#4b3a6b'
              target.style.color = 'white'
            }, 2000)
          })
        }
      }
    }

    document.addEventListener('click', handleCopy)
    return () => document.removeEventListener('click', handleCopy)
  }, [])

  return null
}
