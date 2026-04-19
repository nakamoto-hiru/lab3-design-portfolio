import { useState, useCallback } from 'react'
import Container from '@/components/layout/Container'
import AnimatedSection from '@/components/common/AnimatedSection'
import ProjectCard from './ProjectCard'
import ProjectSidebar from './ProjectSidebar'
import type { WorkFrontmatter } from '@/content/schema'

interface FeaturedGridProps {
  work: Array<{ data: WorkFrontmatter; content: string }>
}

export default function FeaturedGrid({ work }: FeaturedGridProps) {
  const [selected, setSelected] = useState<{ data: WorkFrontmatter; content: string } | null>(null)
  const close = useCallback(() => setSelected(null), [])

  return (
    <section className="border-t border-border py-12">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_3fr] md:gap-0">
          <div className="self-start sticky top-16">
            <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
              Selected work
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {work.map((w, i) => (
              <AnimatedSection key={w.data.slug} delay={i * 0.08}>
                <ProjectCard work={w} onClick={() => setSelected(w)} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </Container>

      <ProjectSidebar work={selected} onClose={close} />
    </section>
  )
}
