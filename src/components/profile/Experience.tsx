import Container from '@/components/layout/Container'
import type { ProfileFrontmatter } from '@/content/schema'

interface ExperienceProps {
  experience: ProfileFrontmatter['experience']
}

export default function Experience({ experience }: ExperienceProps) {
  return (
    <section className="border-t border-border py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_3fr] md:gap-0">
          {/* Label */}
          <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
            Experience
          </p>

          {/* Entries */}
          <div className="space-y-12">
            {experience.map((entry, i) => (
              <div key={i}>
                <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
                  {entry.company} / {entry.role}
                </p>
                <p className="mt-1 text-[0.875rem] tracking-wide text-text-secondary">
                  {entry.period}
                  {entry.location && `, ${entry.location}`}
                </p>
                {entry.description && (
                  <p className="mt-4 max-w-[55ch] text-[0.875rem] leading-[1.6] tracking-wide text-text-primary">
                    {entry.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
