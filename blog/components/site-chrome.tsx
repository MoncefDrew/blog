import Link from "next/link"
import type { SiteStats } from "@/lib/stats"
import { formatVisitorCount } from "@/lib/stats"
import { getSession } from "@/lib/auth/session"

interface SiteFooterProps {
  stats: SiteStats
}

export async function SiteFooter({ stats }: SiteFooterProps) {
  const session = await getSession()

  return (
    <footer className="border-t-2 border-accent bg-content-alt px-4 py-3 text-center text-xs font-mono text-black">
      <p>
        <Link href="/">Home</Link> | <a href="mailto:webmaster@digital-sage.vercel.app">E-mail the Webmaster</a>
      </p>
      <p className="mt-2">Copyright &copy; MCMXCIX&ndash;MMXXVI The Daemon Abyss.</p>
      <p className="mt-1 text-accent">This page has been contemplated {stats.pageViews.toLocaleString("en-US")} times.</p>
      <p className="mt-2">
        <Link 
          href={session.isLoggedIn ? "/writer" : "/login"} 
          className="no-underline hover:underline"
        >
          {session.isLoggedIn ? "[ Writer Dashboard ]" : "[ Writer Login ]"}
        </Link>
      </p>
    </footer>
  )
}

interface SiteDateBarProps {
  stats: SiteStats
}

export function todayString() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function SiteDateBar({ stats }: SiteDateBarProps) {
  return (
    <div className="bg-content-alt border-b border-hairline px-4 py-1 text-xs font-mono text-black flex flex-wrap justify-between gap-2">
      <span>{todayString()}</span>
      <span className="text-accent">You are visitor #{formatVisitorCount(stats.visitors)}</span>
    </div>
  )
}
