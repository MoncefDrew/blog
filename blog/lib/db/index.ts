import { mkdirSync } from "node:fs"
import { dirname } from "node:path"
import { createClient, type Client } from "@libsql/client"
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql"
import { count } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { parseFrontmatter } from "@/lib/markdown"
import { seedPostsData } from "@/lib/seed-posts"
import { posts, siteStats, writers } from "./schema"

let client: Client | null = null
let db: LibSQLDatabase | null = null
let initPromise: Promise<void> | null = null

function getDatabaseUrl(): string {
  return process.env.DATABASE_URL ?? "file:data/blog.db"
}

function getClient(): Client {
  if (!client) {
    const url = getDatabaseUrl()
    if (url.startsWith("file:")) {
      const filePath = url.replace(/^file:/, "")
      mkdirSync(dirname(filePath), { recursive: true })
    }

    client = createClient({
      url,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    })
  }

  return client
}

export function getDb(): LibSQLDatabase {
  if (!db) {
    db = drizzle(getClient())
  }
  return db
}

async function seedPosts(database: LibSQLDatabase): Promise<void> {
  const [{ value: postCount }] = await database.select({ value: count() }).from(posts)
  if (postCount > 0) return

  for (const [slug, markdown] of Object.entries(seedPostsData)) {
    const { frontmatter, content } = parseFrontmatter(markdown)

    await database.insert(posts).values({
      slug,
      title: frontmatter.title,
      description: frontmatter.description ?? null,
      content,
      author: frontmatter.author ?? null,
      readTime: frontmatter.readTime ?? null,
      tags: frontmatter.tags ? JSON.stringify(frontmatter.tags) : null,
      createdAt: frontmatter.createdAt,
      updatedAt: null,
    })
  }
}

async function seedWriter(database: LibSQLDatabase): Promise<void> {
  const [{ value: writerCount }] = await database.select({ value: count() }).from(writers)
  if (writerCount > 0) return

  const username = process.env.WRITER_USERNAME ?? "writer"
  const password = process.env.WRITER_PASSWORD ?? "changeme"
  const passwordHash = await bcrypt.hash(password, 12)

  await database.insert(writers).values({
    username,
    passwordHash,
  })
}

async function initializeDatabase(): Promise<void> {
  const libsql = getClient()

  await libsql.execute(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT,
      content TEXT NOT NULL,
      author TEXT,
      read_time TEXT,
      tags TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      published INTEGER NOT NULL DEFAULT 1
    )
  `)

  await libsql.execute(`
    CREATE TABLE IF NOT EXISTS writers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    )
  `)

  await libsql.execute(`
    CREATE TABLE IF NOT EXISTS site_stats (
      id INTEGER PRIMARY KEY,
      visitors INTEGER NOT NULL DEFAULT 1973,
      page_views INTEGER NOT NULL DEFAULT 1973
    )
  `)

  try {
    await libsql.execute(`ALTER TABLE posts ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0`)
  } catch {
    // Column already exists.
  }

  try {
    await libsql.execute(`ALTER TABLE posts ADD COLUMN published INTEGER NOT NULL DEFAULT 1`)
  } catch {
    // Column already exists.
  }

  const database = getDb()
  await Promise.all([seedPosts(database), seedWriter(database), seedSiteStats(database)])
}

async function seedSiteStats(database: LibSQLDatabase): Promise<void> {
  const [{ value: statsCount }] = await database.select({ value: count() }).from(siteStats)
  if (statsCount > 0) return

  await database.insert(siteStats).values({ id: 1, visitors: 1973, pageViews: 1973 })
}

export function ensureDb(): Promise<void> {
  if (!initPromise) {
    initPromise = initializeDatabase()
  }
  return initPromise
}
