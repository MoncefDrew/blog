import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { createPost, getAllPostRows, parseTagsInput, rowToPostRecord, slugFromTitle } from "@/lib/posts"

async function requireApiWriter() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return null
  }
  return session
}

export async function GET() {
  const rows = await getAllPostRows()
  const posts = rows.map((row) => {
    const post = rowToPostRecord(row)
    return {
      slug: post.slug,
      title: post.title,
      description: post.description,
      author: post.author,
      readTime: post.readTime,
      tags: post.tags,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }
  })

  return NextResponse.json({ posts })
}

export async function POST(request: Request) {
  const session = await requireApiWriter()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

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

  try {
    const post = await createPost({
      slug: body.slug?.trim() || slugFromTitle(body.title),
      title: body.title,
      description: body.description,
      content: body.content,
      author: body.author,
      readTime: body.readTime,
      tags,
      createdAt: body.createdAt ?? new Date().toISOString().slice(0, 10),
    })

    return NextResponse.json({ post: rowToPostRecord(post) }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Could not create post." }, { status: 409 })
  }
}
