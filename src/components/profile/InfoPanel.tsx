import type { ProfileFrontmatter } from '@/content/schema'

interface InfoPanelProps {
  data: ProfileFrontmatter
}

export default function InfoPanel({ data }: InfoPanelProps) {
  return (
    <section className="border-t border-b border-border py-12 sm:py-16 md:py-24">
      <div className="grid grid-cols-1 sm:grid-cols-4">
        <div className="px-6 sm:px-8 md:px-12">
          <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
            Contact
          </p>
        </div>

        <div className="col-span-1 mt-4 px-6 sm:col-span-2 sm:mt-0 sm:px-8 md:px-12">
          <div className="space-y-6">
            {/* Studio name */}
            <div>
              <p className="text-[clamp(1.125rem,1.5vw,1.5rem)] leading-[1.4] font-light text-text-primary">
                {data.name}
              </p>
              <p className="mt-1 text-[0.875rem] tracking-wide text-text-secondary">
                {data.tagline}
              </p>
            </div>

            {/* Contact links */}
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${data.email}`}
                className="text-[0.875rem] tracking-wide text-text-primary underline decoration-accent underline-offset-4 transition-opacity hover:opacity-60"
              >
                {data.email}
              </a>
              {data.socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.875rem] tracking-wide text-text-primary underline decoration-accent underline-offset-4 transition-opacity hover:opacity-60"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Location */}
            <div>
              <p className="text-[0.875rem] tracking-wide text-text-secondary">
                {data.coordinates}
              </p>
              <p className="text-[0.875rem] tracking-wide text-text-secondary">
                {data.location}
              </p>
            </div>

            {/* Availability */}
            {data.availability_label && (
              <p className="text-[0.875rem] tracking-wide text-accent">
                {data.availability_label}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
