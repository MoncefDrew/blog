import Link from "next/link"
import { SiteDateBar, SiteFooter } from "@/components/site-chrome"
import { SiteHeader } from "@/components/site-header"
import { SiteShell } from "@/components/site-shell"
import { SiteSidebar } from "@/components/site-sidebar"
import { getPublicPageData } from "@/lib/public-page"
import Image from "next/image"

export default async function AboutPage() {
  const { stats, topics, topTopics } = await getPublicPageData()

  return (
    <SiteShell>
      <div className="bevel-out p-1">
        <div className="site-inner frame">
          <SiteHeader activePath="/about" topTopics={topTopics} />
          <SiteDateBar stats={stats} />

          <div className="flex flex-col md:flex-row min-w-0">
            <SiteSidebar topics={topics} />

            <main className="flex-1 p-3 sm:p-4 bg-content min-w-0">
              <div className="titlebar-embossed px-3 py-1.5 mb-3">
                <h1 className="text-base md:text-lg font-bold">&#9670; About Me &#9670;</h1>
              </div>

              <div className="frame bg-content-alt p-4 mb-4 flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <Image
                src="/prof.jpg"
                alt="Portrait of Moncef Mokrani"
                width={200}
                height={300}
                aria-hidden="true"
                className="w-28 h-28 shrink-0 object-cover object-[50%_20%] border border-gray-400 rounded-none"
                />
                <div className="text-center sm:text-left">
                  <h2 className="text-lg font-bold text-accent">Moncef Mokrani</h2>
                  <p className="text-xs font-mono mt-1 text-black">System Engineering Graduate &middot; Software Developer</p>
                  <p className="text-xs font-mono text-black">Algeria</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-3 text-pretty">
                I&apos;m Moncef Mokrani, a fresh system engineering graduate from Algeria, and a software developer with
                2 years of experience building scalable and maintainable software solutions.
              </p>
              <p className="text-sm leading-relaxed mb-3 text-pretty">
                I&apos;m currently focusing more on system administration and enterprise software management while
                empowering my understanding of low-level layers and thus improving my problem-solving and analytical
                skills for the future.
              </p>
              <p className="text-sm leading-relaxed mb-4 text-pretty">
                This journal &mdash; <strong>The Daemon Abyss</strong> &mdash; is where I explore Computer Engineering,
                Software Development, and IT topics. Browse the{" "}
                <Link href="/reflections">reflections</Link>, or find me on the{" "}
                <Link href="/links">links page</Link>.
              </p>

              <div className="frame bg-sidebar-bg p-3">
                <div className="titlebar-embossed text-xs px-2 py-1 mb-2">&#9632; FIND ME ONLINE</div>
                <ul className="text-sm leading-7">
                  <li>
                    <a href="https://github.com/moncefdrew" target="_blank" rel="noopener noreferrer">
                      GitHub &raquo;
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/in/moncef-mokrani/" target="_blank" rel="noopener noreferrer">
                      LinkedIn &raquo;
                    </a>
                  </li>
                  <li>
                    <a href="https://x.com/moncefdrew" target="_blank" rel="noopener noreferrer">
                      Twitter / X &raquo;
                    </a>
                  </li>
                  <li>
                    <a href="mailto:moncefmokr@gmail.com">Email &raquo;</a>
                  </li>
                </ul>
              </div>
            </main>
          </div>

          <SiteFooter stats={stats} />
        </div>
      </div>
    </SiteShell>
  )
}
