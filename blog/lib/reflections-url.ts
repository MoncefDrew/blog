export type PostSort = "new" | "popular"

export function reflectionsHref(options?: { sort?: PostSort; topic?: string; q?: string }): string {
  const params = new URLSearchParams()
  if (options?.sort) params.set("sort", options.sort)
  if (options?.topic) params.set("topic", options.topic)
  if (options?.q?.trim()) params.set("q", options.q.trim())
  const query = params.toString()
  return query ? `/reflections?${query}` : "/reflections"
}

export function isSubnavActive(
  current: { sort?: string; topic?: string; q?: string },
  target: { sort?: PostSort; topic?: string },
): boolean {
  if (current.q?.trim()) return false

  if (target.topic) {
    return current.topic?.toLowerCase() === target.topic.toLowerCase()
  }
  if (target.sort) {
    return current.sort === target.sort && !current.topic
  }
  return false
}
