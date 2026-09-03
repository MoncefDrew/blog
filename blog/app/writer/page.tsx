import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteShell } from "@/components/site-shell"
import { getAllPostRows, getPublishedPostRows, getDraftPostRows } from "@/lib/posts"
import { deletePostAction, togglePublishedAction } from "./actions"
import { logoutAction } from "@/app/login/actions"
import { WriterDashboardClient } from "@/components/writer-dashboard-client"
import { DeleteButtonClient } from "@/components/delete-button-client"

export default async function WriterDashboardPage() {
  const publishedPosts = await getPublishedPostRows()
  const draftPosts = await getDraftPostRows()

  return (
    <SiteShell>
      <WriterDashboardClient posts={[...publishedPosts, ...draftPosts]}>
        <div className="bevel-out p-1">
          <div className="site-inner frame">
            <SiteHeader variant="minimal" />

            <main className="p-3 sm:p-4 md:p-6 bg-content min-w-0">
              <div className="titlebar-embossed px-3 py-1.5 mb-4 flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-lg font-bold">&#9632; Writer Dashboard</h1>
                <div className="flex flex-wrap gap-3 text-xs font-mono">
                  <Link href="/writer/posts/new" className="font-bold">
                    [ + New Reflection ]
                  </Link>
                  <form action={logoutAction}>
                    <button type="submit" className="font-bold">
                      [ Sign Out ]
                    </button>
                  </form>
                </div>
              </div>

              <p className="text-sm mb-4">
                Manage reflections stored in the blog database. Changes appear on the public site immediately.
              </p>

              {/* Published Posts Section */}
              <div className="mb-6">
                <div className="titlebar px-3 py-1 mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">&#9679; Published Reflections ({publishedPosts.length})</h2>
                </div>
                {publishedPosts.length === 0 ? (
                  <p className="text-sm font-mono text-black mb-4">No published reflections yet.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {publishedPosts.map((post) => (
                      <article key={post.slug} className="frame bg-content-alt p-3">
                        <h2 className="text-base font-bold text-accent">{post.title}</h2>
                        <p className="text-xs font-mono text-black mt-1">
                          /posts/{post.slug} &middot; {post.createdAt}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm">
                          <Link href={`/writer/posts/${post.slug}/edit`} className="font-bold">
                            [ Edit ]
                          </Link>
                          <Link href={`/posts/${post.slug}`} className="font-bold">
                            [ View ]
                          </Link>
                          <form action={togglePublishedAction}>
                            <input type="hidden" name="slug" value={post.slug} />
                            <button type="submit" className="font-bold text-accent">
                              [ Unpublish ]
                            </button>
                          </form>
                          <form action={deletePostAction} data-delete-slug={post.slug}>
                            <input type="hidden" name="slug" value={post.slug} />
                            <DeleteButtonClient slug={post.slug} />
                          </form>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              {/* Draft Posts Section */}
              <div>
                <div className="titlebar px-3 py-1 mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">&#9679; Draft Reflections ({draftPosts.length})</h2>
                </div>
                {draftPosts.length === 0 ? (
                  <p className="text-sm font-mono text-black mb-4">No draft reflections.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {draftPosts.map((post) => (
                      <article key={post.slug} className="frame bg-content-alt p-3">
                        <h2 className="text-base font-bold text-accent">{post.title}</h2>
                        <p className="text-xs font-mono text-black mt-1">
                          /posts/{post.slug} &middot; {post.createdAt}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm">
                          <Link href={`/writer/posts/${post.slug}/edit`} className="font-bold">
                            [ Edit ]
                          </Link>
                          <form action={togglePublishedAction}>
                            <input type="hidden" name="slug" value={post.slug} />
                            <button type="submit" className="font-bold text-accent">
                              [ Publish ]
                            </button>
                          </form>
                          <form action={deletePostAction} data-delete-slug={post.slug}>
                            <input type="hidden" name="slug" value={post.slug} />
                            <DeleteButtonClient slug={post.slug} />
                          </form>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-center mt-6 text-sm">
                <Link href="/" className="font-bold">
                  [ &laquo; Back to the journal ]
                </Link>
              </p>
            </main>
          </div>
        </div>
      </WriterDashboardClient>
    </SiteShell>
  )
}
