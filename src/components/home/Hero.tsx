import { Link } from 'react-router-dom'
import AnimatedSection from '@/components/common/AnimatedSection'
import { getProfile } from '@/content/loader'

export default function Hero() {
  const profile = getProfile()

  return (
    <section className="border-b border-border pt-12 pb-24">
      <AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-4">
          {/* Col 1: label + location + availability */}
          <div className="px-8 py-0 sm:px-12">
            <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
              {profile.data.title}
            </p>

            <div className="mt-4 text-[0.75rem] leading-relaxed tracking-wide text-text-secondary">
              <p>{profile.data.coordinates}</p>
              <p>{profile.data.location}</p>
            </div>

            <p className="mt-4 text-[0.75rem] tracking-wide text-accent">
              Open to Product / Systems Roles
            </p>
          </div>

          {/* Cols 2-3: intro + CTA (50%) */}
          <div className="col-span-1 mt-4 px-8 sm:col-span-2 sm:mt-0 sm:px-12">
            <p className="max-w-[55ch] text-[clamp(1.125rem,1.5vw,1.5rem)] leading-[1.4] font-light text-text-primary">
              {profile.data.homeIntro || profile.content}
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('featured-work')
                const header = document.querySelector('header')
                if (el) {
                  const headerH = header?.offsetHeight ?? 0
                  const y = el.getBoundingClientRect().top + window.scrollY - headerH
                  window.scrollTo({ top: y, behavior: 'smooth' })
                }
                }}
                className="group inline-flex cursor-pointer items-center gap-3 border border-border px-6 py-4 text-[0.875rem] tracking-wide text-text-primary transition-colors duration-300 hover:border-accent"
              >
                <span>Explore my work</span><span className="text-text-tertiary">/2025-2026</span>
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
              </button>

              <Link
                to="/profile"
                className="group relative inline-flex items-center gap-3 overflow-hidden border border-border px-6 py-4 text-[0.875rem] tracking-wide text-text-primary transition-[border-color] duration-500 hover:border-accent"
              >
                About me
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-accent transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}
