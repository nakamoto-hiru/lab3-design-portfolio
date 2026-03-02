import { motion } from "motion/react";
import { projects } from "@/content/loader";
import { staggerContainer, cardVariants } from "@/lib/animations";
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
    <div className="relative z-10 isolate w-full px-6 pb-24 lg:ml-[25%] lg:w-[75%] lg:px-0">
      <div>
        {/* Mobile + Tablet: single column */}
        <motion.div
          className="flex flex-col gap-0 lg:hidden"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {projects.map((project) => (
            <motion.div key={project.meta.slug} variants={cardVariants}>
              <ProjectCard
                project={project.meta}
                onClick={() => onProjectClick(project.meta.slug)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Desktop: 2-column staggered grid with 1px divider */}
        <div className="hidden lg:grid" style={{ gridTemplateColumns: "1fr 1px 1fr" }}>
          {/* Left column — offset down for stagger effect */}
          <motion.div
            className="mt-[337px] border-t border-l border-border"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
          >
            {leftCol.map((project) => (
              <motion.div key={project.meta.slug} variants={cardVariants}>
                <ProjectCard
                  project={project.meta}
                  onClick={() => onProjectClick(project.meta.slug)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* 1px divider */}
          <div className="bg-border" />

          {/* Right column — starts at top */}
          <motion.div
            className="border-t border-border"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
          >
            {rightCol.map((project) => (
              <motion.div key={project.meta.slug} variants={cardVariants}>
                <ProjectCard
                  project={project.meta}
                  onClick={() => onProjectClick(project.meta.slug)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
