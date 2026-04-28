import AnimatedSection from "@/components/common/AnimatedSection";
import { getProfile } from "@/content/loader";

export default function Hero() {
  const profile = getProfile();

  return (
    <section
      className="border-b border-border"
      style={{ paddingTop: 144, paddingBottom: 144 }}
    >
      <AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-4">
          {/* Col 1: identity + location + availability + tags */}
          <div className="px-6 py-0 sm:px-8 md:px-12">
            <p className="text-[1.125rem] font-semibold tracking-tight text-text-primary">
              {profile.data.title}
            </p>

            {profile.data.tagline && (
              <p className="mt-1 text-[0.8125rem] tracking-wide text-text-secondary">
                {profile.data.tagline}
              </p>
            )}

            <div className="mt-5 text-[0.8125rem] leading-relaxed tracking-wide text-text-secondary">
              <p>
                <a
                  href={`mailto:${profile.data.email}`}
                  className="transition-colors duration-200 hover:text-text-primary"
                >
                  {profile.data.email}
                </a>
              </p>
              {profile.data.phone && (
                <p>
                  <a
                    href={`tel:${profile.data.phone.replace(/\s/g, "")}`}
                    className="transition-colors duration-200 hover:text-text-primary"
                  >
                    {profile.data.phone}
                  </a>
                </p>
              )}
            </div>

            {profile.data.availability_label && (
              <p className="mt-5 flex items-center gap-3 text-[0.8125rem] tracking-wide text-accent">
                <span className="relative inline-flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                {profile.data.availability_label}
              </p>
            )}

            {profile.data.services.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {profile.data.services.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-border px-3 py-1 text-[0.75rem] tracking-wide text-text-secondary"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cols 2-3: intro + CTA (50%) */}
          <div className="col-span-1 mt-4 px-6 sm:col-span-2 sm:mt-0 sm:px-8 md:px-12">
            <div className="max-w-[55ch] space-y-4 text-[clamp(1.125rem,1.5vw,1.5rem)] leading-[1.4] font-light text-text-primary">
              {profile.data.homeIntro && profile.data.homeIntro.length > 0 ? (
                profile.data.homeIntro.map((para, i) => <p key={i}>{para}</p>)
              ) : (
                <p>{profile.content}</p>
              )}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById("featured-work");
                  const header = document.querySelector("header");
                  if (el) {
                    const headerH = header?.offsetHeight ?? 0;
                    const y =
                      el.getBoundingClientRect().top + window.scrollY - headerH;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
                className="group inline-flex cursor-pointer items-center gap-3 border border-border px-6 py-4 text-[0.875rem] tracking-wide text-text-primary transition-colors duration-300 hover:border-accent"
              >
                <span>Explore our work</span>
                <span className="text-text-tertiary">/2025-2026</span>
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
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
