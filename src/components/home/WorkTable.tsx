import Container from '@/components/layout/Container'
import AnimatedSection from '@/components/common/AnimatedSection'
import { workTable } from '@/content/work-table'

export default function WorkTable() {
  return (
    <section className="mt-16 md:mt-24">
      <Container>
        <AnimatedSection>
          {/* Table header — 1fr/3fr grid matching nav + hero */}
          <div className="grid grid-cols-[auto_1fr] gap-x-8 border-b border-border pb-3 md:grid-cols-[1fr_3fr] md:gap-x-0">
            <span className="text-[0.875rem] tracking-wide text-text-secondary">Year</span>
            <div className="flex justify-between">
              <span className="text-[0.875rem] tracking-wide text-text-secondary">Product</span>
              <span className="text-[0.875rem] tracking-wide text-text-secondary">Type</span>
            </div>
          </div>

          {/* Table rows */}
          {workTable.map((entry, i) => (
            <div
              key={i}
              className={`grid grid-cols-[auto_1fr] gap-x-8 py-4 transition-opacity duration-200 hover:opacity-60 md:grid-cols-[1fr_3fr] md:gap-x-0${i < workTable.length - 1 ? ' border-b border-border' : ''}`}
            >
              <span className="text-[0.875rem] tracking-wide text-text-secondary">{entry.year}</span>
              <div className="flex justify-between">
                <span className="text-[0.875rem] tracking-wide text-text-primary">{entry.product}</span>
                <span className="text-[0.875rem] tracking-wide text-text-secondary">{entry.type}</span>
              </div>
            </div>
          ))}
        </AnimatedSection>
      </Container>
    </section>
  )
}
