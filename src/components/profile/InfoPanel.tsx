import Container from '@/components/layout/Container'
import AvailabilityBadge from '@/components/common/AvailabilityBadge'
import type { ProfileFrontmatter } from '@/content/schema'

interface InfoPanelProps {
  data: ProfileFrontmatter
}

export default function InfoPanel({ data }: InfoPanelProps) {
  return (
    <section className="border-t border-border py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_3fr] md:gap-0">
          {/* Label */}
          <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
            Information
          </p>

          {/* Details */}
          <div className="space-y-6">
            {/* Name + Title */}
            <div>
              <p className="text-[0.875rem] tracking-wide text-text-primary">
                {data.name}
              </p>
              <p className="mt-1 text-[0.875rem] tracking-wide text-text-secondary">
                {data.title}
              </p>
            </div>

            {/* Contact */}
            <div>
              <a
                href={`mailto:${data.email}`}
                className="text-[0.875rem] tracking-wide text-text-primary underline decoration-border underline-offset-4 transition-opacity hover:opacity-60"
              >
                {data.email}
              </a>
            </div>

            {/* Social links */}
            <div className="flex gap-4">
              {data.socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.875rem] tracking-wide text-text-primary underline decoration-border underline-offset-4 transition-opacity hover:opacity-60"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>

            {/* Status */}
            <AvailabilityBadge status={data.availability} />

            {/* Location */}
            <div>
              <p className="text-[0.875rem] tracking-wide text-text-secondary">
                {data.coordinates}
              </p>
              <p className="text-[0.875rem] tracking-wide text-text-secondary">
                {data.location}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
