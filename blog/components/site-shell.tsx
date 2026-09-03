import type { ReactNode } from "react"

interface SiteShellProps {
  children: ReactNode
  narrow?: boolean
}

/** Consistent page width — matches the welcome page (max-w-5xl). */
export function SiteShell({ children, narrow = false }: SiteShellProps) {
  return (
    <div className="site-page">
      <div className={ narrow ? "site-window site-window-narrow bg-white" : "site-window bg-white"}>{children}</div>
    </div>
  )
}
