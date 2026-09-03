'use client'

export function DeleteButtonClient({ slug }: { slug: string }) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const event = new CustomEvent<string>('delete-post', { detail: slug })
    window.dispatchEvent(event)
  }

  return (
    <button 
      type="button" 
      className="font-bold text-accent"
      onClick={handleClick}
    >
      [ Delete ]
    </button>
  )
}
