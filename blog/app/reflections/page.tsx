import Link from "next/link"
import { BlogPostCard } from "@/components/blog-post-card"
import { SiteDateBar, SiteFooter } from "@/components/site-chrome"
import { SiteHeader } from "@/components/site-header"
import { SiteShell } from "@/components/site-shell"
import { SiteSidebar } from "@/components/site-sidebar"
import { getFilteredPosts, type PostSort } from "@/lib/posts"
import { getPublicPageData } from "@/lib/public-page"
import { reflectionsHref } from "@/lib/reflections-url"
import { formatTopicLabel } from "@/lib/topics"

interface ReflectionsPageProps {
  searchParams: Promise<{ sort?: string; topic?: string; q?: string }>
}

function parseSort(value?: string): PostSort {
  return value === "popular" ? "popular" : "new"
}

function sectionTitle(sort: PostSort, topic?: string, q?: string) {
  if (q?.trim()) return `Search: "${q.trim()}"`
  if (topic) return `Reflections on ${formatTopicLabel(topic)}`
  if (sort === "popular") return "Most Contemplated Reflections"
  return "Latest Reflections"
}

export default async function ReflectionsPage({ searchParams }: ReflectionsPageProps) {
  const { sort: sortParam, topic, q } = await searchParams
  const sort = parseSort(sortParam)
  const query = q?.trim() ?? ""

  const [{ stats, topics, topTopics }, posts] = await Promise.all([
    getPublicPageData(),
    getFilteredPosts({ sort, topic, q: query }),
  ])

  return (
    <SiteShell>
      <div className="bevel-out p-1">
        <div className="site-inner frame">
          <SiteHeader
            activePath="/reflections"
            topTopics={topTopics}
            searchQuery={query}
            subnav={{ sort, topic, q: query }}
          />
          <SiteDateBar stats={stats} />

          <div className="flex flex-col md:flex-row min-w-0">
            <SiteSidebar topics={topics} activeTopic={topic} searchQuery={query} />

            <main className="flex-1 p-3 sm:p-4 bg-content min-w-0">
              <div className="titlebar-embossed px-3 py-1.5 mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-pretty">
                  &#9642; {sectionTitle(sort, topic, query)} &#9642;
                </h1>
                <span className="text-[10px] font-mono hidden sm:inline shrink-0">[ reflections / index ]</span>
              </div>

              {query ? (
                <p className="text-sm mb-3">
                  {posts.length} result{posts.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;.{" "}
                  <Link href={reflectionsHref({ sort: "new" })} className="font-bold">
                    Clear search
                  </Link>
                </p>
              ) : null}

              {posts.length === 0 ? (
                <p className="text-sm font-mono mb-4">
                  {query
                    ? "No reflections matched your search. Try different keywords."
                    : "No reflections found for this topic yet."}
                </p>
              ) : (
                <div className="flex flex-col gap-3 sm:gap-4">
                  {posts.map((post, i) => (
                    <BlogPostCard key={post.slug} post={post} index={!query && sort === "new" ? i : undefined} />
                  ))}
                </div>
              )}

              <p className="text-center mt-6 text-sm">
                <Link href="/" className="font-bold">
                  [ &laquo; Back to welcome ]
                </Link>
              </p>
            </main>
          </div>

          <SiteFooter stats={stats} />
        </div>
      </div>
    </SiteShell>
  )
}
