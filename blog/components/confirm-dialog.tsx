'use client'

import { useState } from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bevel-out bg-[#d4d0c8] p-1 max-w-md w-full">
        <div className="frame bg-white p-4">
          <div className="titlebar-embossed px-3 py-1.5 mb-3">
            <h3 className="text-sm font-bold text-white">{title}</h3>
          </div>
          <p className="text-sm mb-4 text-black">{message}</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="btn3d px-3 py-1 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="btn3d px-3 py-1 text-xs font-bold text-red-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
