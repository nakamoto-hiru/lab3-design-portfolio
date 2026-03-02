import { projects } from "@/content/loader";
import ProjectCard from "./ProjectCard";

interface ProjectGridProps {
  onProjectClick: (slug: string) => void;
}

export default function ProjectGrid({ onProjectClick }: ProjectGridProps) {
  // Split projects into left (odd-indexed) and right (even-indexed) columns
  // to match the original staggered 2-column layout
  const leftCol = projects.filter((_, i) => i % 2 === 0);
  const rightCol = projects.filter((_, i) => i % 2 === 1);

  return (
    <div className="relative z-10 w-full px-6 pb-24 md:ml-[25%] md:w-[75%] md:px-0">
      <div>
        {/* Mobile: single column */}
        <div className="flex flex-col gap-0 md:hidden">
          {projects.map((project) => (
            <ProjectCard
              key={project.meta.slug}
              project={project.meta}
              onClick={() => onProjectClick(project.meta.slug)}
            />
          ))}
        </div>

        {/* Desktop: 2-column staggered grid with 1px divider */}
        <div className="hidden md:grid" style={{ gridTemplateColumns: "1fr 1px 1fr" }}>
          {/* Left column — offset down for stagger effect */}
          <div className="mt-[337px] border-t border-l border-border">
            {leftCol.map((project) => (
              <ProjectCard
                key={project.meta.slug}
                project={project.meta}
                onClick={() => onProjectClick(project.meta.slug)}
              />
            ))}
          </div>

          {/* 1px divider */}
          <div className="bg-border" />

          {/* Right column — starts at top */}
          <div className="border-t border-border">
            {rightCol.map((project) => (
              <ProjectCard
                key={project.meta.slug}
                project={project.meta}
                onClick={() => onProjectClick(project.meta.slug)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
