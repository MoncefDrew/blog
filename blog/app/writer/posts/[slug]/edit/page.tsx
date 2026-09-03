import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteShell } from "@/components/site-shell"
import { getPostRowBySlug, rowToPostRecord } from "@/lib/posts"
import { updatePostAction } from "@/app/writer/actions"
import { EditorPreviewClient } from "@/components/editor-preview-client"
import { ContentTextareaClient } from "@/components/content-textarea-client"

interface EditPostPageProps {
  params: Promise<{ slug: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params
  const row = await getPostRowBySlug(slug)

  if (!row) {
    notFound()
  }

  const post = rowToPostRecord(row)
  const tags = post.tags?.join(", ") ?? ""

  return (
    <SiteShell>
      <EditorPreviewClient initialContent={post.content}>
        <div className="bevel-out p-1">
          <div className="site-inner frame">
            <SiteHeader variant="minimal" />

            <main className="p-3 sm:p-4 md:p-6 bg-content min-w-0">
              <div className="titlebar-embossed px-3 py-1.5 mb-4">
                <h1 className="text-lg font-bold">&#9632; Edit Reflection</h1>
              </div>

              <form action={updatePostAction} className="flex flex-col gap-3 text-sm">
                <input type="hidden" name="originalSlug" value={post.slug} />

                <label className="font-bold" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  defaultValue={post.title}
                  required
                  className="bevel-in w-full px-2 py-1 font-mono text-black"
                />

                <label className="font-bold" htmlFor="slug">
                  Slug
                </label>
                <input
                  id="slug"
                  name="slug"
                  defaultValue={post.slug}
                  required
                  className="bevel-in w-full px-2 py-1 font-mono text-black"
                />

                <label className="font-bold" htmlFor="description">
                  Description
                </label>
                <input
                  id="description"
                  name="description"
                  defaultValue={post.description ?? ""}
                  className="bevel-in w-full px-2 py-1 font-mono text-black"
                />

                <label className="font-bold" htmlFor="author">
                  Author
                </label>
                <input
                  id="author"
                  name="author"
                  defaultValue={post.author ?? ""}
                  className="bevel-in w-full px-2 py-1 font-mono text-black"
                />

                <label className="font-bold" htmlFor="readTime">
                  Read time
                </label>
                <input
                  id="readTime"
                  name="readTime"
                  defaultValue={post.readTime ?? ""}
                  className="bevel-in w-full px-2 py-1 font-mono text-black"
                />

                <label className="font-bold" htmlFor="createdAt">
                  Published date
                </label>
                <input
                  id="createdAt"
                  name="createdAt"
                  type="date"
                  defaultValue={post.createdAt}
                  required
                  className="bevel-in w-full px-2 py-1 font-mono text-black"
                />

                <label className="font-bold" htmlFor="tags">
                  Tags (comma-separated)
                </label>
                <input id="tags" name="tags" defaultValue={tags} className="bevel-in w-full px-2 py-1 font-mono text-black" />

                <label className="font-bold" htmlFor="published">
                  Status
                </label>
                <select
                  id="published"
                  name="published"
                  defaultValue={String(post.published ?? 1)}
                  className="bevel-in w-full px-2 py-1 font-mono text-black"
                >
                  <option value="1">Published</option>
                  <option value="0">Draft</option>
                </select>

                <label className="font-bold" htmlFor="content">
                  Content (Markdown)
                </label>
                <ContentTextareaClient defaultValue={post.content} />

                <div className="flex flex-wrap gap-3 mt-2">
                  <button type="submit" className="bevel-out px-4 py-1 font-bold text-black">
                    Save Changes
                  </button>
                  <Link href="/writer" className="bevel-out px-4 py-1 font-bold text-black no-underline">
                    Cancel
                  </Link>
                </div>
              </form>
            </main>
          </div>
        </div>
      </EditorPreviewClient>
    </SiteShell>
  )
}
