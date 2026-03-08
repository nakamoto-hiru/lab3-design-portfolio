import Container from '@/components/layout/Container'
import type { ProfileFrontmatter } from '@/content/schema'

interface SkillsProps {
  skills: NonNullable<ProfileFrontmatter['skills']>
}

function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-medium">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

export default function Skills({ skills }: SkillsProps) {
  return (
    <section className="border-t border-border py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_3fr] md:gap-0">
          {/* Label */}
          <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
            Skills
          </p>

          {/* Content */}
          <div>
            <p className="max-w-[55ch] text-[0.875rem] leading-[1.6] tracking-wide text-text-primary">
              {skills.summary}
            </p>

            <ul className="mt-6 max-w-[55ch] list-disc space-y-2 pl-4">
              {skills.items.map((item, i) => (
                <li
                  key={i}
                  className="text-[0.875rem] leading-[1.6] tracking-wide text-text-primary"
                >
                  {renderBold(item)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
