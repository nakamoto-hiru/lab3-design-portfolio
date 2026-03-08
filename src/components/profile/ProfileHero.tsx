import Container from '@/components/layout/Container'

interface ProfileHeroProps {
  content: string
}

export default function ProfileHero({ content }: ProfileHeroProps) {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_3fr] md:gap-0">
          {/* Left: title */}
          <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
            About
          </p>

          {/* Right: intro */}
          <p className="max-w-[55ch] text-[clamp(1.125rem,1.5vw,1.5rem)] leading-[1.4] font-light text-text-primary">
            {content}
          </p>
        </div>
      </Container>
    </section>
  )
}
