import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  author: text("author"),
  readTime: text("read_time"),
  tags: text("tags"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
  viewCount: integer("view_count").notNull().default(0),
  published: integer("published").notNull().default(1),
})

export const writers = sqliteTable("writers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
})

export const siteStats = sqliteTable("site_stats", {
  id: integer("id").primaryKey(),
  visitors: integer("visitors").notNull().default(1973),
  pageViews: integer("page_views").notNull().default(1973),
})

export type PostRow = typeof posts.$inferSelect
export type NewPostRow = typeof posts.$inferInsert
export type WriterRow = typeof writers.$inferSelect
export type SiteStatsRow = typeof siteStats.$inferSelect
