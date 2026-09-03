import { getAllPostRows } from "@/lib/posts"

export interface Topic {
  tag: string
  label: string
  count: number
}

function parseTags(tags: string | null): string[] {
  if (!tags) return []
  try {
    const parsed = JSON.parse(tags) as unknown
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export function formatTopicLabel(tag: string): string {
  return tag
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export function topicToParam(tag: string): string {
  return tag.toLowerCase().trim()
}

export function topicMatches(postTag: string, param: string): boolean {
  return topicToParam(postTag) === topicToParam(param)
}

export async function getTopics(): Promise<Topic[]> {
  const rows = await getAllPostRows()
  const counts = new Map<string, number>()

  for (const row of rows) {
    for (const tag of parseTags(row.tags)) {
      const key = topicToParam(tag)
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({
      tag,
      label: formatTopicLabel(tag),
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

export async function getTopTopics(limit = 3): Promise<Topic[]> {
  const topics = await getTopics()
  return topics.slice(0, limit)
}
