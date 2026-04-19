import Container from '@/components/layout/Container'
import { workTable } from '@/content/work-table'

export default function WorkTable() {
  return (
    <section className="border-t border-border py-12">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_3fr] md:gap-0">
          {/* Left: sticky section label */}
          <div className="self-start sticky top-16">
            <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
              More work
            </p>
          </div>

          {/* Right: table rows */}
          <div>
            {/* Table header */}
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-[0.875rem] tracking-wide text-text-secondary">Product</span>
              <span className="text-[0.875rem] tracking-wide text-text-secondary">Type</span>
            </div>

            {/* Table rows */}
            {workTable.map((entry, i) => (
              <div
                key={i}
                className={`flex justify-between py-4 transition-opacity duration-200 hover:opacity-60${i < workTable.length - 1 ? ' border-b border-border' : ''}`}
              >
                <span className="text-[0.875rem] tracking-wide text-text-primary">{entry.product}</span>
                <span className="text-[0.875rem] tracking-wide text-text-secondary">{entry.type}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
