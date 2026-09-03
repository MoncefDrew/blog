'use client'

import { useState, useEffect } from 'react'
import { ConfirmDialog } from './confirm-dialog'

interface Post {
  slug: string
  title: string
  createdAt: string
}

interface WriterDashboardClientProps {
  posts: Post[]
  children: React.ReactNode
}

export function WriterDashboardClient({ posts, children }: WriterDashboardClientProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    slug: string | null
  }>({
    isOpen: false,
    slug: null
  })

  useEffect(() => {
    const handleDeleteEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      setDeleteDialog({ isOpen: true, slug: customEvent.detail })
    }

    window.addEventListener('delete-post', handleDeleteEvent as EventListener)
    return () => window.removeEventListener('delete-post', handleDeleteEvent as EventListener)
  }, [])

  const handleDeleteConfirm = () => {
    if (deleteDialog.slug) {
      // Find and submit the delete form
      const form = document.querySelector(`form[data-delete-slug="${deleteDialog.slug}"]`) as HTMLFormElement
      if (form) {
        form.submit()
      }
    }
    setDeleteDialog({ isOpen: false, slug: null })
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, slug: null })
  }

  return (
    <>
      {children}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this reflection? This action cannot be undone."
      />
    </>
  )
}
