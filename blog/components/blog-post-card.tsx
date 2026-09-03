import Link from "next/link"
import { memo } from "react"
import type { BlogPost } from "@/lib/markdown"
import { reflectionsHref } from "@/lib/reflections-url"
import { topicToParam } from "@/lib/topics"

interface BlogPostCardProps {
  post: BlogPost
  index?: number
}

function BlogPostCardComponent({ post, index = 0 }: BlogPostCardProps) {
  const dateStr = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <article className="frame bg-content p-3">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-accent font-bold text-lg leading-none">&#9654;</span>
        <h2 className="text-lg font-bold leading-tight">
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h2>
      </div>

      <p className="text-xs font-mono text-black mb-2">
        Posted {dateStr}
        {post.author ? <> by {post.author}</> : null}
        {post.readTime ? <> &middot; {post.readTime}</> : null}
        {index === 0 ? <span className="text-accent font-bold"> &middot; NEW!</span> : null}
      </p>

      {post.description && <p className="text-sm italic mb-2 text-pretty">{post.description}</p>}

      <p className="text-sm leading-relaxed mb-2 text-pretty">{post.excerpt}</p>

      {post.tags && post.tags.length > 0 && (
        <p className="text-xs font-mono text-black mb-2">
          Filed under:{" "}
          {post.tags.slice(0, 4).map((tag, i) => (
            <span key={tag}>
              {i > 0 ? ", " : ""}
              <Link href={reflectionsHref({ topic: topicToParam(tag) })}>{tag}</Link>
            </span>
          ))}
        </p>
      )}

      <Link href={`/posts/${post.slug}`} className="text-sm font-bold">
        [ Read the full reflection &raquo; ]
      </Link>
    </article>
  )
}

export const BlogPostCard = memo(BlogPostCardComponent)
