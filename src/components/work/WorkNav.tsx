import { Link } from 'react-router-dom'
import Container from '@/components/layout/Container'
import { getFeaturedWork } from '@/content/loader'

interface WorkNavProps {
  currentSlug: string
}

export default function WorkNav({ currentSlug }: WorkNavProps) {
  const allWork = getFeaturedWork()
  const currentIndex = allWork.findIndex((w) => w.data.slug === currentSlug)

  // Wrap around: last -> first, first -> last
  const prevWork = currentIndex > 0 ? allWork[currentIndex - 1] : allWork[allWork.length - 1]
  const nextWork = currentIndex < allWork.length - 1 ? allWork[currentIndex + 1] : allWork[0]

  if (!prevWork || !nextWork) return null

  return (
    <section className="mt-16 md:mt-24">
      <Container>
        <div className="grid grid-cols-2 border-t border-b border-border">
          {/* Prev */}
          <Link
            to={`/work/${prevWork.data.slug}`}
            className="group py-8 pr-4 md:py-12"
          >
            <span className="text-[0.875rem] tracking-wide text-text-secondary">
              Prev
            </span>
            <p className="mt-1 text-[0.875rem] font-medium tracking-wide text-text-primary transition-opacity duration-300 group-hover:opacity-60">
              {prevWork.data.title}
            </p>
          </Link>

          {/* Next */}
          <Link
            to={`/work/${nextWork.data.slug}`}
            className="group border-l border-border py-8 pl-4 text-right md:py-12"
          >
            <span className="text-[0.875rem] tracking-wide text-text-secondary">
              Next
            </span>
            <p className="mt-1 text-[0.875rem] font-medium tracking-wide text-text-primary transition-opacity duration-300 group-hover:opacity-60">
              {nextWork.data.title}
            </p>
          </Link>
        </div>
      </Container>
    </section>
  )
}
