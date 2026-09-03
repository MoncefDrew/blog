import Link from "next/link"
import { BlogPostCard } from "@/components/blog-post-card"
import { SiteDateBar, SiteFooter } from "@/components/site-chrome"
import { SiteHeader } from "@/components/site-header"
import { SiteShell } from "@/components/site-shell"
import { SiteSidebar } from "@/components/site-sidebar"
import { getSortedBlogPosts } from "@/lib/blog-data"
import { getPublicPageData } from "@/lib/public-page"

export default async function HomePage() {
  const [{ stats, topics, topTopics }, posts] = await Promise.all([getPublicPageData(), getSortedBlogPosts()])

  return (
    <SiteShell>
      <div className=" p-1">
        <div className="site-inner frame">
          <SiteHeader activePath="/" topTopics={topTopics} />
          <SiteDateBar stats={stats} />

          <div className="flex flex-col md:flex-row min-w-0">
            <SiteSidebar topics={topics} />

            <main className="flex-1 p-3 sm:p-4 bg-content min-w-0">
              <div className="titlebar-embossed px-3 py-1.5 mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h1 className=" sm:text-base  font-bold text-pretty">&#9670;Welcome&#9670;</h1>
                <span className="text-[10px] font-mono hidden sm:inline shrink-0">[ home / index.html ]</span>
              </div>
              <p className="text-md leading-relaxed mb-3 text-pretty">
                <b>Hello, traveler beyond the fog!</b> You have reached a humble corner of the World Wide Web devoted to  
                to explain IT topics and deep dive into concepts ,paradigms and techniques of the tech world.
                This blog was created by <Link href="/about">me</Link> as a Systems Engineering fresh graduate of  and a Software Developer ,
                all i do here is learning new IT topics and give you the best of it.
              </p>
              

              <div className="titlebar-embossed px-3 py-1.5 text-xs sm:text-sm mb-3 flex items-center justify-between gap-2">
                <span className="font-bold">&#9642; LATEST REFLECTIONS &#9642;</span>
                <span className="blink text-[10px] font-mono shrink-0">UPDATED!</span>
              </div>

              <div className="flex flex-col gap-3 sm:gap-4">
                {posts.map((post, i) => (
                  <BlogPostCard key={post.slug} post={post} index={i} />
                ))}
              </div>

              <p className="text-center mt-4 text-sm">
                <Link href="/reflections" className="font-bold">
                  [ Browse all reflections &raquo; ]
                </Link>
              </p>

              <div className="frame bg-content-alt p-3 sm:p-4 mt-6">
                <p className="text-sm italic text-pretty">
                  &ldquo;Non-technical questions sometimes don't have an answer at all.&rdquo;
                </p>
                <p className="text-xs text-right mt-2 font-mono text-accent">&mdash; from &ldquo;Linus Torvalds&rdquo;</p>
              </div>
            </main>
          </div>

          <SiteFooter stats={stats} />
        </div>
      </div>
    </SiteShell>
  )
}
