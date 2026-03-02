import type { ProjectMeta } from "@/lib/markdown";

interface CaseStudyHeaderProps {
  meta: ProjectMeta;
}

export default function CaseStudyHeader({ meta }: CaseStudyHeaderProps) {
  return (
    <>
      <header className="max-w-[720px] pt-12 md:pt-20">
        <div className="flex flex-wrap gap-2 mb-4">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="text-[12px] uppercase tracking-[0.1em] text-text-secondary border border-border px-2 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-[clamp(32px,4vw,64px)] leading-[1.1] tracking-tight font-medium text-text-primary">
          {meta.title}
        </h1>
        <p className="mt-4 text-[18px] text-text-secondary">{meta.subtitle}</p>
      </header>

      <div className="mt-8 max-w-[720px] grid grid-cols-2 gap-6 md:grid-cols-4 border-t border-b border-border py-6">
        <div>
          <p className="text-[12px] uppercase tracking-[0.1em] text-text-secondary">
            Year
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{meta.year}</p>
        </div>
        <div>
          <p className="text-[12px] uppercase tracking-[0.1em] text-text-secondary">
            Role
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{meta.role}</p>
        </div>
      </div>
    </>
  );
}
