'use client'

import { useEffect, useState } from 'react'

interface XPLoadingProps {
  message?: string
}

export function XPLoading({ message = 'Loading...' }: XPLoadingProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0
        return prev + 10
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#008080] flex items-center justify-center p-4">
      <div className="bg-[#ece9d8] p-6 rounded-sm shadow-2xl max-w-md w-full border-2 border-gray-400">
        <p className="text-black text-sm font-bold mb-4">{message}</p>
        
        {/* Windows XP-style red loading bar */}
        <div className="bg-white border-2 border-gray-400 p-1 rounded-sm h-6">
          <div 
            className="h-full bg-gradient-to-b from-[#ff6b6b] to-[#c0392b] border border-[#922b21] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mt-2 text-right">
          <p className="text-xs text-gray-600 font-mono">{progress}% complete</p>
        </div>
      </div>
    </div>
  )
}
