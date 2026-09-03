"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireWriter } from "@/lib/auth/require-writer"
import {
  createPost,
  deletePost,
  parseTagsInput,
  slugFromTitle,
  updatePost,
  togglePostPublished,
} from "@/lib/posts"

function readPostInput(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim()
  const slugInput = String(formData.get("slug") ?? "").trim()
  const slug = slugInput || slugFromTitle(title)
  const description = String(formData.get("description") ?? "").trim()
  const content = String(formData.get("content") ?? "").trim()
  const author = String(formData.get("author") ?? "").trim()
  const readTime = String(formData.get("readTime") ?? "").trim()
  const createdAt = String(formData.get("createdAt") ?? "").trim()
  const tags = parseTagsInput(String(formData.get("tags") ?? ""))
  
  // The button that was clicked will have the "published" value
  const published = String(formData.get("published") ?? "1")

  return {
    slug,
    title,
    description: description || undefined,
    content,
    author: author || undefined,
    readTime: readTime || undefined,
    tags: tags.length ? tags : undefined,
    createdAt: createdAt || new Date().toISOString().slice(0, 10),
    published: published === "1" ? 1 : 0,
  }
}

function revalidatePostPaths(slug: string, previousSlug?: string) {
  revalidatePath("/")
  revalidatePath("/posts/[slug]", "page")
  revalidatePath(`/posts/${slug}`)
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/posts/${previousSlug}`)
  }
  revalidatePath("/sitemap.xml")
}

export async function createPostAction(formData: FormData) {
  await requireWriter()

  const input = readPostInput(formData)
  if (!input.title || !input.content) {
    redirect("/writer/posts/new?error=validation")
  }

  try {
    await createPost(input)
  } catch {
    redirect("/writer/posts/new?error=slug")
  }

  revalidatePostPaths(input.slug)
  redirect("/writer")
}

export async function updatePostAction(formData: FormData) {
  await requireWriter()

  const originalSlug = String(formData.get("originalSlug") ?? "").trim()
  const input = readPostInput(formData)

  if (!originalSlug || !input.title || !input.content) {
    redirect(`/writer/posts/${originalSlug}/edit?error=validation`)
  }

  const updated = await updatePost(originalSlug, input)
  if (!updated) {
    redirect(`/writer/posts/${originalSlug}/edit?error=missing`)
  }

  revalidatePostPaths(input.slug, originalSlug)
  redirect("/writer")
}

export async function deletePostAction(formData: FormData) {
  await requireWriter()

  const slug = String(formData.get("slug") ?? "").trim()
  if (!slug) return

  await deletePost(slug)
  revalidatePostPaths(slug)
  redirect("/writer")
}

export async function togglePublishedAction(formData: FormData) {
  await requireWriter()

  const slug = String(formData.get("slug") ?? "").trim()
  if (!slug) return

  await togglePostPublished(slug)
  revalidatePostPaths(slug)
  redirect("/writer")
}
