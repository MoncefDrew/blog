import { desc, eq, sql } from "drizzle-orm"
import { ensureDb, getDb } from "@/lib/db"
import { posts, type PostRow } from "@/lib/db/schema"
import {
  type BlogPost,
  createSlug,
  generateExcerpt,
  markdownToHtml,
} from "@/lib/markdown"
import { topicMatches } from "@/lib/topics"
import { unstable_cache } from "next/cache"

export type PostSort = "new" | "popular"

export interface PostFilter {
  sort?: PostSort
  topic?: string
  q?: string
}

export interface PostInput {
  slug: string
  title: string
  description?: string
  content: string
  author?: string
  readTime?: string
  tags?: string[]
  createdAt: string
  published?: number
}

function parseTags(tags: string | null): string[] | undefined {
  if (!tags) return undefined
  try {
    const parsed = JSON.parse(tags) as unknown
    return Array.isArray(parsed) ? parsed.map(String) : undefined
  } catch {
    return undefined
  }
}

export function rowToBlogPost(row: PostRow): BlogPost {
  const tags = parseTags(row.tags)
  const excerpt = generateExcerpt(row.content)

  return {
    slug: row.slug,
    title: row.title,
    description: row.description ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt ?? undefined,
    author: row.author ?? undefined,
    readTime: row.readTime ?? undefined,
    tags,
    content: markdownToHtml(row.content),
    excerpt,
    viewCount: row.viewCount ?? 0,
  }
}

export function rowToPostRecord(row: PostRow) {
  return {
    ...row,
    tags: parseTags(row.tags),
  }
}

// Cache getAllPosts to avoid repeated database calls
export async function getAllPosts(): Promise<BlogPost[]> {
  return unstable_cache(
    async () => {
      await ensureDb()
      const rows = await getDb().select().from(posts).where(eq(posts.published, 1)).orderBy(desc(posts.createdAt))
      return rows.map(rowToBlogPost)
    },
    ['all-posts'],
    { revalidate: 300 } // Cache for 5 minutes
  )()
}

export async function getFilteredPosts(filter: PostFilter = {}): Promise<BlogPost[]> {
  let result = await getAllPosts()

  if (filter.q?.trim()) {
    const query = filter.q.trim().toLowerCase()
    result = result.filter((post) => {
      const haystack = [
        post.title,
        post.description,
        post.excerpt,
        post.author,
        post.tags?.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return haystack.includes(query)
    })
  }

  if (filter.topic) {
    result = result.filter((post) => post.tags?.some((tag) => topicMatches(tag, filter.topic!)))
  }

  if (filter.sort === "popular") {
    result = [...result].sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
  }

  return result
}

export async function incrementPostView(slug: string): Promise<void> {
  await ensureDb()
  await getDb()
    .update(posts)
    .set({ viewCount: sql`${posts.viewCount} + 1` })
    .where(eq(posts.slug, slug))
}

// Cache getPostBySlug for better performance on individual post pages
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return unstable_cache(
    async (slug: string) => {
      await ensureDb()
      const [row] = await getDb().select().from(posts).where(eq(posts.slug, slug)).limit(1)
      return row ? rowToBlogPost(row) : null
    },
    ['post-by-slug', slug],
    { revalidate: 300 } // Cache for 5 minutes
  )(slug)
}

export async function getPostRowBySlug(slug: string): Promise<PostRow | null> {
  await ensureDb()
  const [row] = await getDb().select().from(posts).where(eq(posts.slug, slug)).limit(1)
  return row ?? null
}

export async function getAllPostRows(): Promise<PostRow[]> {
  await ensureDb()
  return getDb().select().from(posts).orderBy(desc(posts.createdAt))
}

export async function getPublishedPostRows(): Promise<PostRow[]> {
  await ensureDb()
  return getDb().select().from(posts).where(eq(posts.published, 1)).orderBy(desc(posts.createdAt))
}

export async function getDraftPostRows(): Promise<PostRow[]> {
  await ensureDb()
  return getDb().select().from(posts).where(eq(posts.published, 0)).orderBy(desc(posts.createdAt))
}

export async function createPost(input: PostInput): Promise<PostRow> {
  await ensureDb()
  const now = new Date().toISOString()

  const [row] = await getDb()
    .insert(posts)
    .values({
      slug: input.slug,
      title: input.title,
      description: input.description ?? null,
      content: input.content,
      author: input.author ?? null,
      readTime: input.readTime ?? null,
      tags: input.tags?.length ? JSON.stringify(input.tags) : null,
      createdAt: input.createdAt,
      updatedAt: now,
      published: input.published ?? 1,
    })
    .returning()

  return row
}

export async function updatePost(slug: string, input: PostInput): Promise<PostRow | null> {
  await ensureDb()
  const now = new Date().toISOString()

  const [row] = await getDb()
    .update(posts)
    .set({
      slug: input.slug,
      title: input.title,
      description: input.description ?? null,
      content: input.content,
      author: input.author ?? null,
      readTime: input.readTime ?? null,
      tags: input.tags?.length ? JSON.stringify(input.tags) : null,
      createdAt: input.createdAt,
      updatedAt: now,
      published: input.published ?? 1,
    })
    .where(eq(posts.slug, slug))
    .returning()

  return row ?? null
}

export async function deletePost(slug: string): Promise<boolean> {
  await ensureDb()
  const result = await getDb().delete(posts).where(eq(posts.slug, slug)).returning({ id: posts.id })
  return result.length > 0
}

export async function togglePostPublished(slug: string): Promise<PostRow | null> {
  await ensureDb()
  const [row] = await getDb().select().from(posts).where(eq(posts.slug, slug)).limit(1)
  
  if (!row) return null
  
  const newPublishedStatus = row.published === 1 ? 0 : 1
  const [updatedRow] = await getDb()
    .update(posts)
    .set({ published: newPublishedStatus })
    .where(eq(posts.slug, slug))
    .returning()
    
  return updatedRow ?? null
}

export function slugFromTitle(title: string): string {
  return createSlug(title)
}

export function parseTagsInput(tags: string): string[] {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}
