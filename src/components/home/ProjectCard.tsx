import type { WorkFrontmatter } from '@/content/schema'

interface ProjectCardProps {
  work: { data: WorkFrontmatter }
  onClick?: () => void
}

export default function ProjectCard({ work, onClick }: ProjectCardProps) {
  const { title, type, year } = work.data

  return (
    <button
      onClick={onClick}
      className="group relative flex h-full w-full cursor-pointer flex-col justify-end bg-bg text-left transition-colors duration-500 hover:bg-bg-secondary"
    >
      {/* Title + meta — bottom-left */}
      <div className="p-12">
        <span className="block text-[0.875rem] font-medium tracking-wide text-text-primary transition-colors duration-300 group-hover:text-accent">
          {title}
        </span>
        <span className="mt-1 block text-[0.75rem] tracking-wide text-text-tertiary">
          {year}
        </span>
      </div>

      {/* Arrow — hover reveal, bottom-right */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="absolute top-12 right-12 -translate-x-2 scale-100 text-accent opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:scale-[4] group-hover:opacity-100"
      >
        <path d="M7 17L17 7" />
        <path d="M7 7h10v10" />
      </svg>
    </button>
  )
}
