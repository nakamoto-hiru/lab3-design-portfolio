import Container from '@/components/layout/Container'
import AnimatedSection from '@/components/common/AnimatedSection'
import { getProfile } from '@/content/loader'

export default function Hero() {
  const profile = getProfile()

  return (
    <section className="py-12">
      <Container>
        <AnimatedSection>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_3fr] md:gap-0">
            {/* Left: label */}
            <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
              {profile.data.title}
            </p>

            {/* Right: intro */}
            <p className="max-w-[55ch] text-[clamp(1.125rem,1.5vw,1.5rem)] leading-[1.4] font-light text-text-primary">
              {profile.data.homeIntro || profile.content}
            </p>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  )
}
