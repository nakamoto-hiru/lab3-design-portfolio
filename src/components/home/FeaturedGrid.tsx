import Container from '@/components/layout/Container'
import AnimatedSection from '@/components/common/AnimatedSection'
import ProjectCard from './ProjectCard'
import type { WorkFrontmatter } from '@/content/schema'

interface FeaturedGridProps {
  work: Array<{ data: WorkFrontmatter; content: string }>
}

export default function FeaturedGrid({ work }: FeaturedGridProps) {
  return (
    <section>
      <Container>
        {/* Section header — same 1fr/3fr grid as nav + hero */}
        <AnimatedSection>
          <div className="mb-4 grid grid-cols-1 items-baseline border-b border-border pb-4 md:grid-cols-[1fr_3fr]">
            <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
              Selected work
            </p>
            <p className="text-[0.875rem] tracking-wide text-text-secondary">
              2025 — Trading, AI & Design Systems
            </p>
          </div>
        </AnimatedSection>

        {/* Project grid */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-2 md:gap-x-5">
          {work.map((w, i) => (
            <AnimatedSection key={w.data.slug} delay={i * 0.1}>
              <ProjectCard work={w} />
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  )
}
