import { eq, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { ensureDb, getDb } from "@/lib/db"
import { siteStats } from "@/lib/db/schema"

export interface SiteStats {
  visitors: number
  pageViews: number
}

const DEFAULT_STATS: SiteStats = { visitors: 1973, pageViews: 1973 }

async function ensureStatsRow() {
  await ensureDb()
  const [row] = await getDb().select().from(siteStats).where(eq(siteStats.id, 1)).limit(1)
  if (!row) {
    await getDb().insert(siteStats).values({ id: 1, visitors: 1973, pageViews: 1973 })
  }
}

export async function getSiteStats(): Promise<SiteStats> {
  await ensureStatsRow()
  const [row] = await getDb().select().from(siteStats).where(eq(siteStats.id, 1)).limit(1)
  if (!row) return DEFAULT_STATS
  return { visitors: row.visitors, pageViews: row.pageViews }
}

export async function recordSiteVisit(): Promise<SiteStats> {
  await ensureStatsRow()
  const requestHeaders = await headers()
  const isNewVisitor = requestHeaders.get("x-new-visitor") === "1"

  if (isNewVisitor) {
    await getDb()
      .update(siteStats)
      .set({ visitors: sql`${siteStats.visitors} + 1` })
      .where(eq(siteStats.id, 1))
  }

  await getDb()
    .update(siteStats)
    .set({ pageViews: sql`${siteStats.pageViews} + 1` })
    .where(eq(siteStats.id, 1))

  return getSiteStats()
}

export function formatVisitorCount(count: number): string {
  return count.toLocaleString("en-US").padStart(11, "0")
}
