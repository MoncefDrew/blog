import Link from "next/link"
import { SiteDateBar, SiteFooter } from "@/components/site-chrome"
import { SiteHeader } from "@/components/site-header"
import { SiteShell } from "@/components/site-shell"
import { SiteSidebar } from "@/components/site-sidebar"
import { getPublicPageData } from "@/lib/public-page"

export default async function NotFound() {
  const { stats, topics, topTopics } = await getPublicPageData()

  return (
    <SiteShell>
      <div className="bevel-out p-1">
        <div className="site-inner frame">
          <SiteHeader activePath="/reflections" topTopics={topTopics} />
          <SiteDateBar stats={stats} />

          <div className="flex flex-col md:flex-row min-w-0">
            <SiteSidebar topics={topics} />

            <main className="flex-1 p-4 sm:p-6 bg-content text-center min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold text-accent mb-2 text-pretty">
                Error 404 &mdash; Reflection Not Found
              </h1>
              <hr className="border-hairline mb-4" />

              <img
                src="/images/alan-watts-photo.jpeg"
                alt="Portrait of Alan Watts"
                width={96}
                height={96}
                className="w-24 h-24 frame object-cover mx-auto mb-4"
              />

              <p className="text-sm mb-4 text-pretty max-w-xl mx-auto">
                The wisdom you seek has not yet been written, or perhaps it exists in the space between thoughts where
                words cannot reach.
              </p>

              <div className="frame bg-content-alt p-4 mb-6 max-w-xl mx-auto">
                <p className="text-sm italic text-pretty">
                  &ldquo;The real question is not whether the page exists, but whether the seeker who looks for it
                  understands that what they truly seek was never on any page at all.&rdquo;
                </p>
                <p className="text-xs font-mono text-accent mt-2">&mdash; The Digital Sage</p>
              </div>

              <p>
                <Link href="/reflections" className="font-bold">
                  [ &laquo; Return to all reflections ]
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
