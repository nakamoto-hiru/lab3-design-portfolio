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
              {data.phone && (
                <a
                  href={`tel:${data.phone.replace(/\s+/g, '')}`}
                  className="text-[0.875rem] tracking-wide text-text-primary underline decoration-accent underline-offset-4 transition-opacity hover:opacity-60"
                >
                  {data.phone}
                </a>
              )}
            </div>

            {/* Availability */}
            {data.availability_label && (
              <p className="flex items-center gap-3 text-[0.875rem] tracking-wide text-accent">
                <span className="relative inline-flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                {data.availability_label}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
