'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Image as ImageIcon, Upload } from 'lucide-react'
import { useUploadThing } from "@/lib/uploadthing-client"

interface ImageUploadProps {
  onImageInsert: (imageUrl: string) => void
}

export function ImageUpload({ onImageInsert }: ImageUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dialogPosition, setDialogPosition] = useState({ top: 0, right: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        onImageInsert(res[0].url)
        setIsOpen(false)
      }
    },
    onUploadError: (error: Error) => {
      alert(`ERROR! ${error.message}`)
    },
  })

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDialogPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      })
    }
  }, [isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      startUpload([files[0]])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bevel-out flex items-center gap-2 px-3 py-1 font-bold text-black text-sm"
      >
        <ImageIcon className="w-4 h-4" />
        Insert Image
      </button>

      {isOpen && (
        <div 
          className="fixed p-4 bevel-out bg-content z-50 w-80"
          style={{ top: `${dialogPosition.top}px`, right: `${dialogPosition.right}px` }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm text-black">Upload Image</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bevel-out px-2 py-1 font-bold text-black text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleButtonClick}
              disabled={isUploading}
              className="ut-button flex items-center justify-center gap-2 px-4 py-2 font-bold text-black"
            >
              <Upload className="w-4 h-4" />
              {isUploading ? "Uploading..." : "Choose File"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />

            <p className="text-xs font-mono text-black">
              Upload images up to 4MB. Supported formats: JPEG, PNG, GIF, WebP.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}