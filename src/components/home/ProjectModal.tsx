import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ParsedProject } from "@/lib/markdown";
import { useScrollLock } from "@/hooks/useScrollLock";

interface ProjectModalProps {
  project: ParsedProject | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useScrollLock(!!project);

  useEffect(() => {
    if (project) {
      panelRef.current?.scrollTo(0, 0);
    }
  }, [project]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 bottom-0 left-0 z-[9999] flex w-full max-w-[1800px]"
        >
          {/* Left 25% — semi-transparent overlay */}
          <div
            className="hidden md:block md:w-[25%] md:shrink-0"
            style={{ background: "rgba(0, 0, 0, 0.3)" }}
            onClick={onClose}
          />

          {/* Mobile overlay bg */}
          <div
            className="absolute inset-0 md:hidden"
            style={{ background: "rgba(0, 0, 0, 0.3)" }}
            onClick={onClose}
          />

          {/* Right 75% — scrollable panel */}
          <div
            ref={panelRef}
            className="relative z-10 w-full overflow-y-auto bg-bg-card md:w-[75%]"
          >
            {/* Close button — fixed at top of panel */}
            <div className="sticky top-0 z-20 flex h-16 items-center border-b border-border bg-bg-card px-6 md:h-[130px]">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-[16px] text-text-secondary transition-colors duration-300 hover:text-text-primary"
              >
                ← Close
              </button>
            </div>

            {/* Project content */}
            <div className="px-6 pt-12 pb-24 md:pt-20 md:pb-32">
              {/* Title */}
              <h1 className="max-w-[75%] text-[clamp(32px,3.5vw,56px)] leading-[1.2] tracking-[-0.16vw] font-normal text-text-primary">
                {project.meta.title}
              </h1>

              {/* Description + Metadata row */}
              <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:gap-6">
                {/* Description (left ~75%) */}
                <div className="md:w-[75%]">
                  <p className="text-[20px] leading-[30px] font-normal text-text-primary">
                    {project.meta.description}
                  </p>
                </div>

                {/* Metadata sidebar (right ~25%) */}
                <div className="flex flex-wrap gap-6 md:w-[25%] md:flex-col md:gap-4">
                  <div>
                    <h5 className="text-[14px] text-text-secondary">Role</h5>
                    <h5 className="mt-1 text-[14px] text-text-primary">{project.meta.role}</h5>
                  </div>
                  <div>
                    <h5 className="text-[14px] text-text-secondary">Industry</h5>
                    <h5 className="mt-1 text-[14px] text-text-primary">
                      {project.meta.tags.join(", ")}
                    </h5>
                  </div>
                  <div>
                    <h5 className="text-[14px] text-text-secondary">Year</h5>
                    <h5 className="mt-1 text-[14px] text-text-primary">{project.meta.year}</h5>
                  </div>
                </div>
              </div>

              {/* Image gallery */}
              <div className="mt-12 flex flex-col gap-6 md:mt-16">
                {/* Full-width hero image */}
                <div
                  className="aspect-[4/3] w-full"
                  style={{
                    background: `linear-gradient(135deg, ${project.meta.color}20, ${project.meta.color}05)`,
                    border: "1px solid var(--color-border)",
                  }}
                />

                {/* 2-column grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div
                    className="aspect-square w-full"
                    style={{
                      background: `linear-gradient(180deg, ${project.meta.color}15, ${project.meta.color}05)`,
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <div
                    className="aspect-square w-full"
                    style={{
                      background: `linear-gradient(0deg, ${project.meta.color}15, ${project.meta.color}05)`,
                      border: "1px solid var(--color-border)",
                    }}
                  />
                </div>

                {/* Full-width image */}
                <div
                  className="aspect-[4/3] w-full"
                  style={{
                    background: `linear-gradient(225deg, ${project.meta.color}18, ${project.meta.color}05)`,
                    border: "1px solid var(--color-border)",
                  }}
                />

                {/* Scope section */}
                <div className="mt-8 md:mt-12">
                  <h2 className="mb-6 text-[14px] uppercase tracking-[0.1em] text-text-secondary">
                    Scope
                  </h2>
                  <ul className="space-y-0">
                    {project.meta.scope.map((item, i) => (
                      <li
                        key={i}
                        className="border-t border-border py-4 text-[16px] leading-[24px] text-text-primary md:text-[20px] md:leading-[30px]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Impact section */}
                <div className="mt-8 md:mt-12">
                  <h2 className="mb-6 text-[14px] uppercase tracking-[0.1em] text-text-secondary">
                    Impact
                  </h2>
                  <ul className="space-y-0">
                    {project.meta.impact.map((item, i) => (
                      <li
                        key={i}
                        className="border-t border-border py-4 text-[16px] leading-[24px] text-text-primary md:text-[20px] md:leading-[30px]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2-column images */}
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-12">
                  <div
                    className="aspect-square w-full"
                    style={{
                      background: `linear-gradient(135deg, ${project.meta.color}12, ${project.meta.color}05)`,
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <div
                    className="aspect-square w-full"
                    style={{
                      background: `linear-gradient(315deg, ${project.meta.color}12, ${project.meta.color}05)`,
                      border: "1px solid var(--color-border)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
