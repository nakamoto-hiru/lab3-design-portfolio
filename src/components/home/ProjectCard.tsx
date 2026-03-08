import { Link } from 'react-router-dom'
import type { WorkFrontmatter } from '@/content/schema'

interface ProjectCardProps {
  work: { data: WorkFrontmatter }
}

function hasImage(url?: string) {
  return url && url.length > 0 && (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/'))
}

export default function ProjectCard({ work }: ProjectCardProps) {
  const { slug, title, type, thumbnailImage } = work.data

  return (
    <Link to={`/work/${slug}`} className="group block">
      <div className="aspect-[4/5] w-full overflow-hidden bg-bg-secondary">
        {hasImage(thumbnailImage) ? (
          <img
            src={thumbnailImage}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <span className="text-[0.875rem] font-medium tracking-wide text-text-primary transition-opacity duration-300 group-hover:opacity-70">
            {title}
          </span>
          <span className="mt-1 block text-[0.875rem] tracking-wide text-text-secondary">
            {type}
          </span>
        </div>

        {/* Arrow — visible on hover */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mt-0.5 shrink-0 -translate-x-2 text-text-secondary opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
        >
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </div>
    </Link>
  )
}
