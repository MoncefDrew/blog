import Link from "next/link"
import { getSession } from "@/lib/auth/session"
import { getAllPostRows } from "@/lib/posts"
import type { Topic } from "@/lib/topics"
import { isSubnavActive, reflectionsHref, type PostSort } from "@/lib/reflections-url"
import { SiteSearchForm } from "@/components/site-search-form"
import Image from "next/image"
import logo from "@/public/sword.png"
import { unstable_cache } from "next/cache"

const NAV_ITEMS = [
  { label: "WELCOME", href: "/" as const },
  { label: "REFLECTIONS", href: "/reflections" as const },
  { label: "ABOUT ME", href: "/about" as const },
  { label: "LINKS", href: "/links" as const },
] as const

// Cache the post count to avoid repeated database calls
const getCachedPostCount = unstable_cache(
  async () => {
    const posts = await getAllPostRows()
    return posts.length
  },
  ['post-count'],
  { revalidate: 300 } // Cache for 5 minutes
)

interface SiteHeaderProps {
  variant?: "full" | "minimal"
  activePath?: "/" | "/reflections" | "/about" | "/links"
  topTopics?: Topic[]
  searchQuery?: string
  subnav?: {
    sort?: string
    topic?: string
    q?: string
  }
}

export async function SiteHeader({
  variant = "full",
  activePath = "/",
  topTopics = [],
  searchQuery = "",
  subnav = {},
}: SiteHeaderProps) {
  const [session, postCount] = await Promise.all([getSession(), getCachedPostCount()])

  const subnavItems = [
    { label: "New Today", href: reflectionsHref({ sort: "new" }), match: { sort: "new" as PostSort } },
    {
      label: "Most Contemplated",
      href: reflectionsHref({ sort: "popular" }),
      match: { sort: "popular" as PostSort },
    },
    ...topTopics.map((topic) => ({
      label: topic.label,
      href: reflectionsHref({ topic: topic.tag }),
      match: { topic: topic.tag },
    })),
  ]

  return (
    <header className="min-w-0">
      {variant === "full" ? (
        <div className="titlebar-embossed marquee text-[10px] sm:text-xs font-mono py-0.5 px-2" aria-hidden="true">
          <span>
            {"\u2727"} The Digital Sage &mdash; {postCount} reflections on mind &amp; machine {"\u2727"} Best with tea
            {"\u2727"}
          </span>
        </div>
      ) : null}

      <div className="bg-content px-3 sm:px-4 pt-3 pb-2 border-b border-hairline">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Image
              src={logo}
              alt="The Digital Sage"
              width={52}
              height={52}
              aria-hidden="true"
              className="bevel-out w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center text-accent text-2xl sm:text-3xl font-bold transition-transform hover:scale-105"
            />

            <div className="min-w-0">
              <Link href="/" className="no-underline leading-tight block">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-black tracking-tight hover:text-accent transition-colors">
                  The Daemon <span className="text-accent italic">Abyss</span>
                </span>
              </Link>
              <p className="text-[10px] sm:text-xs text-black mt-0.5 font-mono truncate">
                ~ reflections in the spirit of the tech ~
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0 lg:max-w-md lg:flex-1 lg:justify-end">
            {variant === "full" ? (
              <SiteSearchForm defaultQuery={searchQuery} compact />
            ) : null}
          </div>
        </div>
      </div>

      {variant === "full" ? (
        <>
          <nav aria-label="Primary" className="bg-content px-1 sm:px-2 border-b border-hairline nav-scroll">
            <ul className="flex items-end gap-0.5 text-[10px] sm:text-xs md:text-sm w-max min-w-full sm:w-auto sm:min-w-0">
              {NAV_ITEMS.map((item) => {
                const isActive = activePath === item.href
                return (
                  <li key={item.label} className="shrink-0">
                    <Link
                      href={item.href}
                      className={`tab ${isActive ? "tab-active" : ""} block px-2.5 sm:px-3 py-1.5 no-underline hover:no-underline`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <nav aria-label="Browse reflections" className="titlebar-embossed border-b-2 border-accent nav-scroll">
            <ul className="flex items-center text-[10px] sm:text-[11px] md:text-xs px-2 py-1.5 w-max min-w-full sm:w-auto sm:min-w-0 sm:flex-wrap gap-y-1">
              {subnavItems.map((item, i) => {
                const active = isSubnavActive(subnav, item.match)
                return (
                  <li key={item.label} className="flex items-center shrink-0">
                    {i > 0 ? <span className="px-1.5 sm:px-2 text-white/45" aria-hidden="true">|</span> : null}
                    <Link
                      href={item.href}
                      className={`no-underline visited:text-nav-foreground ${
                        active ? "font-bold underline text-white" : "text-nav-foreground hover:underline"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </>
      ) : null}
    </header>
  )
}
