import YAML from 'yaml'
import { workFrontmatterSchema, profileFrontmatterSchema } from './schema'
import type { WorkFrontmatter, ProfileFrontmatter } from './schema'

function parseFrontmatter<T>(raw: string, schema: { parse: (v: unknown) => T }): { data: T; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) throw new Error('Invalid frontmatter format')

  const frontmatter = YAML.parse(match[1])
  const data = schema.parse(frontmatter)
  const content = match[2].trim()
  return { data, content }
}

// Load all work markdown files eagerly at build time
const workModules = import.meta.glob('./work/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function getAllWork(): Array<{ data: WorkFrontmatter; content: string }> {
  return Object.values(workModules).map((raw) => {
    const parsed = parseFrontmatter(raw as string, workFrontmatterSchema)
    if (!parsed.data.thumbnailImage) {
      return {
        ...parsed,
        data: { ...parsed.data, thumbnailImage: `/images/${parsed.data.slug}/cover.png` },
      }
    }
    return parsed
  })
}

export function getFeaturedWork() {
  return getAllWork()
    .filter((w) => w.data.featured)
    .sort((a, b) => (a.data.featuredOrder ?? 99) - (b.data.featuredOrder ?? 99))
}

export function getWorkBySlug(slug: string) {
  return getAllWork().find((w) => w.data.slug === slug) ?? null
}

// Load profile markdown
const profileModules = import.meta.glob('./profile.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export function getProfile(): { data: ProfileFrontmatter; content: string } {
  const raw = Object.values(profileModules)[0] as string
  return parseFrontmatter(raw, profileFrontmatterSchema)
}
