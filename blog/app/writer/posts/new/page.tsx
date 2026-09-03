import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteShell } from "@/components/site-shell"
import { createPostAction } from "@/app/writer/actions"
import { EditorPreviewClient } from "@/components/editor-preview-client"
import { ContentTextareaClient } from "@/components/content-textarea-client"

export default function NewPostPage() {
  const today = new Date().toISOString().slice(0, 10)

  return (
    <SiteShell>
      <EditorPreviewClient initialContent="">
        <div className="bevel-out p-1">
          <div className="site-inner frame">
            <SiteHeader variant="minimal" />

            <main className="p-3 sm:p-4 md:p-6 bg-content min-w-0">
              <div className="titlebar-embossed px-3 py-1.5 mb-4">
                <h1 className="text-lg font-bold">&#9632; New Reflection</h1>
              </div>

              <form action={createPostAction} className="flex flex-col gap-3 text-sm">
                <label className="font-bold" htmlFor="title">
                  Title
                </label>
                <input id="title" name="title" required className="bevel-in w-full px-2 py-1 font-mono text-black" />

                <label className="font-bold" htmlFor="slug">
                  Slug
                </label>
                <input
                  id="slug"
                  name="slug"
                  placeholder="auto-generated from title if empty"
                  className="bevel-in w-full px-2 py-1 font-mono text-black"
                />

                <label className="font-bold" htmlFor="description">
                  Description
                </label>
                <input id="description" name="description" className="bevel-in w-full px-2 py-1 font-mono text-black" />

                <label className="font-bold" htmlFor="author">
                  Author
                </label>
                <input
                  id="author"
                  name="author"
                  defaultValue="AI Alan Watts"
                  className="bevel-in w-full px-2 py-1 font-mono text-black"
                />

                <label className="font-bold" htmlFor="readTime">
                  Read time
                </label>
                <input
                  id="readTime"
                  name="readTime"
                  placeholder="15 min read"
                  className="bevel-in w-full px-2 py-1 font-mono text-black"
                />

                <label className="font-bold" htmlFor="createdAt">
                  Published date
                </label>
                <input
                  id="createdAt"
                  name="createdAt"
                  type="date"
                  defaultValue={today}
                  required
                  className="bevel-in w-full px-2 py-1 font-mono text-black"
                />

                <label className="font-bold" htmlFor="tags">
                  Tags (comma-separated)
                </label>
                <input
                  id="tags"
                  name="tags"
                  placeholder="philosophy, technology"
                  className="bevel-in w-full px-2 py-1 font-mono text-black"
                />

                <label className="font-bold" htmlFor="published">
                  Status
                </label>
                <select
                  id="published"
                  name="published"
                  defaultValue="1"
                  className="bevel-in w-full px-2 py-1 font-mono text-black"
                >
                  <option value="1">Published</option>
                  <option value="0">Draft</option>
                </select>

                <label className="font-bold" htmlFor="content">
                  Content (Markdown)
                </label>
                <ContentTextareaClient />

                <div className="flex flex-wrap gap-3 mt-2">
                  <button type="submit" className="bevel-out px-4 py-1 font-bold text-black">
                    Create Reflection
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
