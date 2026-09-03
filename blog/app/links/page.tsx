import Link from "next/link"
import { SiteDateBar, SiteFooter } from "@/components/site-chrome"
import { SiteHeader } from "@/components/site-header"
import { SiteShell } from "@/components/site-shell"
import { SiteSidebar } from "@/components/site-sidebar"
import { getPublicPageData } from "@/lib/public-page"

const PERSONAL_LINKS = [
  {
    title: "GitHub",
    href: "https://github.com/moncefdrew",
    description: "Open-source projects, code samples, and software experiments.",
  },
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/moncef-mokrani/",
    description: "Professional profile, experience, and career updates.",
  },
  {
    title: "Twitter / X",
    href: "https://x.com/moncefdrew",
    description: "Thoughts, links, and occasional musings from the timeline.",
  },
  {
    title: "Email",
    href: "mailto:moncefmokr@gmail.com",
    description: "Drop me a line at moncefmokr@gmail.com.",
  },
] as const

const READING_LINKS = [
  {
    title: "Alan Watts Organization",
    href: "https://alanwatts.org/",
    description: "Official archive, lectures, and writings of Alan Watts.",
  },
  {
    title: "Stanford Encyclopedia of Philosophy",
    href: "https://plato.stanford.edu/",
    description: "Peer-reviewed entries on consciousness, mind, and Eastern philosophy.",
  },
  {
    title: "Internet Archive",
    href: "https://archive.org/",
    description: "A digital library preserving the wisdom of ages past.",
  },
] as const

export default async function LinksPage() {
  const { stats, topics, topTopics } = await getPublicPageData()

  return (
    <SiteShell>
      <div className="bevel-out p-1">
        <div className="site-inner frame">
          <SiteHeader activePath="/links" topTopics={topTopics} />
          <SiteDateBar stats={stats} />

          <div className="flex flex-col md:flex-row min-w-0">
            <SiteSidebar topics={topics} />

            <main className="flex-1 p-3 sm:p-4 bg-content min-w-0">
              <div className="titlebar-embossed px-3 py-1.5 mb-3">
                <h1 className="text-base md:text-lg font-bold">&#9670; Links &#9670;</h1>
              </div>

              <p className="text-sm mb-4 text-pretty">
                Hyperlinks to find <strong>Moncef Mokrani</strong> on the wider web, plus a few favorite destinations
                for the philosophically inclined traveler.
              </p>

              <div className="titlebar-embossed px-3 py-1 text-xs mb-2">&#9632; CONTACT &amp; SOCIAL</div>
              <ul className="flex flex-col gap-3 mb-6">
                {PERSONAL_LINKS.map((link) => (
                  <li key={link.href} className="frame bg-content-alt p-3 min-w-0">
                    <a
                      href={link.href}
                      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      className="font-bold text-base"
                    >
                      {link.title} &raquo;
                    </a>
                    <p className="text-sm mt-1 text-pretty">{link.description}</p>
                  </li>
                ))}
              </ul>

              <div className="titlebar-embossed px-3 py-1 text-xs mb-2">&#9632; FURTHER READING</div>
              <ul className="flex flex-col gap-3">
                {READING_LINKS.map((link) => (
                  <li key={link.href} className="frame bg-content-alt p-3 min-w-0">
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="font-bold text-base">
                      {link.title} &raquo;
                    </a>
                    <p className="text-sm mt-1 text-pretty">{link.description}</p>
                  </li>
                ))}
              </ul>

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
