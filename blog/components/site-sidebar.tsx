import Link from "next/link"
import type { Topic } from "@/lib/topics"
import { reflectionsHref } from "@/lib/reflections-url"
import { SiteSearchForm } from "@/components/site-search-form"
import { OnlineStatus } from "@/components/online-status"

interface SiteSidebarProps {
  topics: Topic[]
  activeTopic?: string
  searchQuery?: string
}

export function SiteSidebar({ topics, activeTopic, searchQuery = "" }: SiteSidebarProps) {
  return (
    <aside className="w-full md:w-52 lg:w-56 shrink-0 bg-content-alt border-b md:border-b-0 md:border-r border-hairline p-3 flex flex-col gap-3 sm:gap-4 min-w-0">
      <div className="frame bg-sidebar-bg min-w-0">
        <div className="titlebar-embossed text-[10px] sm:text-xs px-2 py-1">&#9632; SEARCH</div>
        <div className="p-2">
          <SiteSearchForm defaultQuery={searchQuery} />
        </div>
      </div>

      <div className="frame bg-sidebar-bg min-w-0">
        <div className="titlebar-embossed text-[10px] sm:text-xs px-2 py-1">&#9632; BROWSE TOPICS</div>
        <ul className="p-2 text-xs sm:text-sm leading-6 break-words">
          <li>
            <Link href={reflectionsHref({ sort: "new" })} className={!activeTopic && !searchQuery ? "font-bold" : undefined}>
              All Reflections
            </Link>
          </li>
          {topics.map((topic) => (
            <li key={topic.tag}>
              <Link
                href={reflectionsHref({ topic: topic.tag })}
                className={activeTopic === topic.tag ? "font-bold text-accent" : undefined}
              >
                {topic.label} ({topic.count})
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="frame bg-sidebar-bg p-2 text-center hidden sm:block">
        <img
          src="/prof.jpg"
          alt="Portrait of philosopher Alan Watts"
          width={200}
          height={200}
          className="w-full max-w-[180px] mx-auto frame"
        />
        <div className="text-[11px] font-mono mt-1 text-black">Author: Moncef Mokrani</div>
        <div className="mt-2 flex justify-center">
          <OnlineStatus />
        </div>
      </div>

      <div className="frame bg-black text-center p-2 hidden md:block">
        <div className="text-[10px] font-mono text-green-400 leading-tight">
          Best viewed in
          <br />
          Netscape Navigator 4.0
          <br />
          at 800&times;600
        </div>
      </div>

      <div className="text-center hidden sm:block">
        <span className="blink text-xs font-bold text-accent font-mono">* NEW! *</span>
      </div>
    </aside>
  )
}
