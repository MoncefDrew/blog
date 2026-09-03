import { notFound } from "next/navigation"
import Link from "next/link"
import { getBlogPost, getSortedBlogPosts } from "@/lib/blog-data"
import { SiteDateBar, SiteFooter } from "@/components/site-chrome"
import { SiteHeader } from "@/components/site-header"
import { SiteShell } from "@/components/site-shell"
import { SiteSidebar } from "@/components/site-sidebar"
import { incrementPostView } from "@/lib/posts"
import { getPublicPageData } from "@/lib/public-page"
import { reflectionsHref } from "@/lib/reflections-url"
import { topicToParam } from "@/lib/topics"
import { SITE_URL } from "@/lib/site"
import { CodeBlockRenderer } from "@/components/code-block-renderer"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = await getSortedBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  const publishedTime = new Date(post.createdAt).toISOString()
  const modifiedTime = post.updatedAt ? new Date(post.updatedAt).toISOString() : publishedTime

  return {
    title: post.title,
    description: post.description || post.excerpt,
    keywords: post.tags?.join(", "),
    authors: [{ name: post.author || "The Digital Sage" }],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description || post.excerpt,
      url: `${SITE_URL}/posts/${slug}`,
      siteName: "The Digital Sage",
      publishedTime,
      modifiedTime,
      authors: [post.author || "The Digital Sage"],
      tags: post.tags,
      images: [
        {
          url: "/images/alan-watts-portrait.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || post.excerpt,
      images: ["/images/alan-watts-portrait.png"],
    },
    alternates: {
      canonical: `/posts/${slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  const [{ stats, topics, topTopics }, post] = await Promise.all([
    getPublicPageData(),
    getBlogPost(slug).then(async (found) => {
      if (found) await incrementPostView(slug)
      return found
    }),
  ])

  if (!post) {
    notFound()
  }

  const dateStr = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || post.excerpt,
    image: `${SITE_URL}/images/alan-watts-portrait.png`,
    author: {
      "@type": "Person",
      name: post.author || "The Daemon Abbyss",
      description: "An Exp",
    },
    publisher: {
      "@type": "Organization",
      name: "The Digital Sage",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/alan-watts-portrait.png`,
      },
    },
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date(post.createdAt).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/posts/${slug}`,
    },
    url: `${SITE_URL}/posts/${slug}`,
    keywords: post.tags?.join(", "),
    wordCount: post.content.replace(/<[^>]*>/g, "").split(/\s+/).length,
    timeRequired: post.readTime,
    inLanguage: "en-US",
    about: [
      { "@type": "Thing", name: "Philosophy" },
      { "@type": "Person", name: "Alan Watts" },
    ],
    mentions: post.tags?.map((tag) => ({ "@type": "Thing", name: tag })),
  }

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bevel-out p-1">
        <div className="site-inner frame">
          <SiteHeader activePath="/reflections" topTopics={topTopics} />
          <SiteDateBar stats={stats} />

          <div className="bg-content-alt border-b border-hairline px-4 py-1 text-xs font-mono">
            <Link href="/">Home</Link> &raquo; <Link href="/reflections">Reflections</Link> &raquo;{" "}
            <span className="text-black">{post.title}</span>
          </div>

          <div className="flex flex-col md:flex-row min-w-0">
            <SiteSidebar topics={topics} />

            <main className="flex-1 p-3 sm:p-4 md:p-6 bg-content min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-accent leading-tight mb-2 text-balance">
                {post.title}
              </h1>

              {post.description && <p className="text-base italic mb-3 text-pretty">{post.description}</p>}

              <p className="text-xs font-mono text-black mb-3">
                Posted {dateStr}
                {post.author ? <> by {post.author}</> : null}
                {post.readTime ? <> &middot; {post.readTime}</> : null}
              </p>

              {post.tags && post.tags.length > 0 && (
                <p className="text-xs font-mono text-black mb-3">
                  Filed under:{" "}
                  {post.tags.map((tag, i) => (
                    <span key={tag}>
                      {i > 0 ? ", " : ""}
                      <Link href={reflectionsHref({ topic: topicToParam(tag) })}>{tag}</Link>
                    </span>
                  ))}
                </p>
              )}

              <hr className="border-hairline mb-4" />

              <CodeBlockRenderer content={post.content} className="retro-prose text-base" />

              

              <p className="text-center mt-6">
                <Link href="/reflections" className="font-bold">
                  [ &laquo; Back to all reflections ]
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
