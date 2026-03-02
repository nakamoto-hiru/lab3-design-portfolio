import type { ProjectMeta } from "@/lib/markdown";

interface ProjectCardProps {
  project: ProjectMeta;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <button
      onClick={onClick}
      className="group block w-full cursor-pointer border-b border-border bg-bg pb-12 pt-6 text-left md:px-6"
    >
      {/* 1:1 Square thumbnail */}
      <div
        className="aspect-square w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${project.color}18, ${project.color}08)`,
        }}
      >
        <div className="flex h-full items-center justify-center">
          <span
            className="text-[min(8vw,80px)] font-medium tracking-[-0.04em] opacity-15"
            style={{ color: project.color }}
          >
            {project.title
              .split(" ")
              .map((w) => w[0])
              .join("")}
          </span>
        </div>
      </div>

      {/* Title + Year + Arrow */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[16px] leading-[24px] font-medium text-text-primary">
            {project.title}
          </h3>
          <p className="mt-1 text-[13px] text-text-secondary">
            {project.year}
          </p>
        </div>
        <span className="mt-1 text-[16px] text-text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          →
        </span>
      </div>
    </button>
  );
}
