import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth/session"
import { deletePost, getPostRowBySlug, parseTagsInput, rowToPostRecord, updatePost } from "@/lib/posts"

interface RouteContext {
  params: Promise<{ slug: string }>
}

async function requireApiWriter() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return null
  }
  return session
}

function revalidatePostPaths(slug: string, previousSlug?: string) {
  revalidatePath("/")
  revalidatePath(`/posts/${slug}`)
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/posts/${previousSlug}`)
  }
  revalidatePath("/sitemap.xml")
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params
  const row = await getPostRowBySlug(slug)

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ post: rowToPostRecord(row) })
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await requireApiWriter()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug: originalSlug } = await context.params
  const body = (await request.json()) as {
    slug?: string
    title?: string
    description?: string
    content?: string
    author?: string
    readTime?: string
    tags?: string[] | string
    createdAt?: string
  }

  if (!body.title || !body.content) {
    return NextResponse.json({ error: "Title and content are required." }, { status: 400 })
  }

  const tags = Array.isArray(body.tags) ? body.tags : parseTagsInput(String(body.tags ?? ""))
  const updated = await updatePost(originalSlug, {
    slug: body.slug ?? originalSlug,
    title: body.title,
    description: body.description,
    content: body.content,
    author: body.author,
    readTime: body.readTime,
    tags,
    createdAt: body.createdAt ?? new Date().toISOString().slice(0, 10),
  })

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  revalidatePostPaths(updated.slug, originalSlug)
  return NextResponse.json({ post: rowToPostRecord(updated) })
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireApiWriter()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug } = await context.params
  const deleted = await deletePost(slug)

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  revalidatePostPaths(slug)
  return NextResponse.json({ ok: true })
}
