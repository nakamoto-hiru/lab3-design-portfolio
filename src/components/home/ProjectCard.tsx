import type { WorkFrontmatter } from '@/content/schema'

interface ProjectCardProps {
  work: { data: WorkFrontmatter }
  onClick?: () => void
}

export default function ProjectCard({ work, onClick }: ProjectCardProps) {
  const { title, type } = work.data

  return (
    <button onClick={onClick} className="group block w-full text-left cursor-pointer">
      <div className="aspect-[4/5] w-full bg-bg-secondary" />
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <span className="text-[0.875rem] font-medium tracking-wide text-text-primary transition-opacity duration-300 group-hover:opacity-70">
            {title}
          </span>
          <span className="mt-1 block text-[0.875rem] tracking-wide text-text-secondary">
            {type}
          </span>
        </div>

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
    </button>
  )
}
