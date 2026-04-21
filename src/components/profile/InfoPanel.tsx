import type { ProfileFrontmatter } from '@/content/schema'

interface InfoPanelProps {
  data: ProfileFrontmatter
}

export default function InfoPanel({ data }: InfoPanelProps) {
  return (
    <section className="border-t border-border py-12 sm:py-16 md:py-24">
      <div className="grid grid-cols-1 sm:grid-cols-4">
        <div className="px-6 sm:px-8 md:px-12">
          <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
            Information
          </p>
        </div>

        <div className="col-span-1 mt-4 px-6 sm:col-span-2 sm:mt-0 sm:px-8 md:px-12">
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

            {/* Download Resume */}
            <a style={{ marginTop: 48 }}
              href="/resume.pdf"
              download
              className="group inline-flex items-center gap-3 border border-border px-6 py-4 text-[0.875rem] tracking-wide text-text-primary transition-colors duration-300 hover:border-accent"
            >
              <span>Download my resume</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-accent transition-transform duration-300 group-hover:translate-y-0.5"
              >
                <path d="M12 5v14" />
                <path d="M19 12l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
