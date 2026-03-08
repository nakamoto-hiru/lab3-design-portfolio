import Container from '@/components/layout/Container'
import { getProfile } from '@/content/loader'

export default function Hero() {
  const profile = getProfile()

  return (
    <section className="pt-16 pb-16 md:pt-24 md:pb-24">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_3fr] md:gap-0">
          {/* Left: role + coordinates */}
          <div>
            <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
              {profile.data.title}
            </p>
            <p className="mt-4 text-[0.875rem] tracking-wide text-text-secondary">
              {profile.data.coordinates}
              <br />
              {profile.data.location}
            </p>
            <p className="mt-4 text-[0.875rem] tracking-wide text-accent">
              Open to Product / Systems Roles
            </p>
          </div>

          {/* Right: intro paragraph */}
          <p className="max-w-[55ch] text-[clamp(1.125rem,1.5vw,1.5rem)] leading-[1.4] font-light text-text-primary">
            {profile.data.homeIntro || profile.content}
          </p>
        </div>
      </Container>
    </section>
  )
}
