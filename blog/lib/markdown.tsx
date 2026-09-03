import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export interface BlogPost {
  slug: string
  title: string
  description?: string
  createdAt: string
  updatedAt?: string
  author?: string
  readTime?: string
  tags?: string[]
  content: string
  excerpt?: string
  viewCount?: number
}

export interface FrontMatter {
  title: string
  description?: string
  createdAt: string
  author?: string
  readTime?: string
  tags?: string[]
  [key: string]: any
}

/**
 * Parse frontmatter from markdown content
 */
export function parseFrontmatter(content: string): { frontmatter: FrontMatter; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    throw new Error("No frontmatter found in markdown file")
  }

  const [, frontmatterStr, markdownContent] = match
  const frontmatter: Partial<FrontMatter> = {}

  // Parse YAML-like frontmatter
  const lines = frontmatterStr.split("\n")
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const colonIndex = trimmed.indexOf(":")
    if (colonIndex === -1) continue

    const key = trimmed.slice(0, colonIndex).trim()
    let value = trimmed.slice(colonIndex + 1).trim()

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    // Handle arrays (tags)
    if (value.startsWith("[") && value.endsWith("]")) {
      const arrayContent = value.slice(1, -1)
      frontmatter[key] = arrayContent.split(",").map((item) => item.trim().replace(/['"]/g, ""))
    } else {
      frontmatter[key] = value
    }
  }

  return {
    frontmatter: frontmatter as FrontMatter,
    content: markdownContent.trim(),
  }
}

/**
 * Convert markdown to HTML (basic implementation)
 */
export function markdownToHtml(markdown: string): string {
  let html = markdown

  // Headers
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>")
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>")
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>")

  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")

  // Images - ensure they're displayed as images, not links (must process before links)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    // Handle Google redirect URLs - extract the actual URL if possible
    let finalSrc = src.trim();
    if (src.includes('google.com/url')) {
      try {
        const urlObj = new URL(src);
        const actualUrl = urlObj.searchParams.get('url');
        if (actualUrl) {
          finalSrc = actualUrl;
        }
      } catch (e) {
        // If URL parsing fails, keep original
      }
    }
    
    // Handle relative paths and make them absolute
    const isExternal = finalSrc.startsWith('http://') || finalSrc.startsWith('https://');
    const imageSrc = isExternal ? finalSrc : (finalSrc.startsWith('/') ? finalSrc : `/${finalSrc}`);
    
    // Render as image with proper styling
    return `<img src="${imageSrc}" alt="${alt || 'Image'}" loading="lazy" style="max-width: 100%; height: auto; border-radius: 0; margin: 1rem 0;" />`;
  })

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  // Code blocks with language specification (e.g., ```javascript)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || 'javascript'
    const trimmedCode = code.trim()
    const originalCode = trimmedCode.replace(/"/g, '&quot;').replace(/'/g, '&#039;')
    // Use a data attribute to store the code for client-side rendering
    return `<div class="code-block-wrapper" data-language="${language}" data-code="${originalCode}"></div>`
  })

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>")

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")

  // Paragraphs
  const paragraphs = html.split("\n\n")
  html = paragraphs
    .map((p) => {
      const trimmed = p.trim()
      if (!trimmed) return ""
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol")
      ) {
        return trimmed
      }
      return `<p>${trimmed}</p>`
    })
    .join("\n")

  return html
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, maxLength = 200): string {
  // Remove markdown formatting for excerpt
  const text = content
    .replace(/#{1,6}\s+/g, "") // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold
    .replace(/\*([^*]+)\*/g, "$1") // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links, keep text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Remove images entirely
    .replace(/`([^`]+)`/g, "$1") // Remove inline code
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/^>\s+/gm, "") // Remove blockquotes
    .trim()

  if (text.length <= maxLength) return text

  const truncated = text.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")

  return lastSpace > 0 ? truncated.slice(0, lastSpace) + "..." : truncated + "..."
}

/**
 * Create slug from title
 */
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

/**
 * Process a markdown file into a BlogPost
 */
export function processMarkdownFile(content: string, filename?: string): BlogPost {
  const { frontmatter, content: markdownContent } = parseFrontmatter(content)

  const slug = filename ? filename.replace(".md", "") : createSlug(frontmatter.title)
  const excerpt = generateExcerpt(markdownContent)
  const htmlContent = markdownToHtml(markdownContent)

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    createdAt: frontmatter.createdAt,
    author: frontmatter.author,
    readTime: frontmatter.readTime,
    tags: frontmatter.tags,
    content: htmlContent,
    excerpt,
  }
}
