import { recordSiteVisit } from "@/lib/stats"
import { getTopics, getTopTopics } from "@/lib/topics"
import { unstable_cache } from "next/cache"

export async function getPublicPageData() {
  const [stats, topics, topTopics] = await Promise.all([
    recordSiteVisit(),
    unstable_cache(
      async () => getTopics(),
      ['topics'],
      { revalidate: 600 } // Cache for 10 minutes
    )(),
    unstable_cache(
      async (count: number) => getTopTopics(count),
      ['top-topics'],
      { revalidate: 600 } // Cache for 10 minutes
    )(3)
  ])
  return { stats, topics, topTopics }
}
