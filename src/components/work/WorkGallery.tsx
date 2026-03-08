import Container from '@/components/layout/Container'
import type { WorkFrontmatter } from '@/content/schema'

interface WorkGalleryProps {
  data: WorkFrontmatter
}

function hasImage(url?: string) {
  return url && url.length > 0 && (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/'))
}

function ImageBlock({ src, alt, cols }: { src: string; alt: string; cols: number }) {
  return (
    <div className={`aspect-[8/5] ${cols === 1 ? '' : 'md:aspect-[4/5]'} overflow-hidden bg-bg-secondary ring-1 ring-border`}>
      {hasImage(src) ? (
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full" />
      )}
    </div>
  )
}

/**
 * Gallery layout:
 * - 'full': all images stacked full-width
 * - 'pattern': repeating 1-2-2 row pattern
 */
export default function WorkGallery({ data }: WorkGalleryProps) {
  if (data.galleryImages.length === 0) return null

  if (data.galleryLayout === 'full') {
    return (
      <section className="space-y-4">
        <Container className="space-y-4">
          {data.galleryImages.map((img, i) => (
            <ImageBlock key={i} src={img} alt={`${data.title} gallery ${i + 1}`} cols={1} />
          ))}
        </Container>
      </section>
    )
  }

  // Build rows: [1], [2], [2], [1], [2], [2], ...
  const pattern = [1, 2, 2]
  const rows: string[][] = []
  let idx = 0
  let step = 0

  while (idx < data.galleryImages.length) {
    const count = pattern[step % pattern.length]
    const row: string[] = []
    for (let i = 0; i < count && idx < data.galleryImages.length; i++) {
      row.push(data.galleryImages[idx])
      idx += 1
    }
    rows.push(row)
    step += 1
  }

  const gridClass = (len: number) => {
    if (len === 2) return 'grid grid-cols-1 gap-4 md:grid-cols-2'
    return ''
  }

  return (
    <section className="space-y-4">
      <Container className="space-y-4">
        {rows.map((row, ri) => (
          <div key={ri} className={gridClass(row.length)}>
            {row.map((img, ci) => (
              <ImageBlock
                key={`${ri}-${ci}`}
                src={img}
                alt={`${data.title} gallery ${ri + ci + 1}`}
                cols={row.length}
              />
            ))}
          </div>
        ))}
      </Container>
    </section>
  )
}
