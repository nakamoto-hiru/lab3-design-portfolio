import Container from './Container'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer>
      <Container>
        <div className="grid grid-cols-[1fr_auto] items-center py-8 md:grid-cols-[1fr_3fr] md:py-12">
          {/* Copyright — aligned with logo */}
          <p className="text-[0.875rem] tracking-wide text-text-secondary">
            &copy; {new Date().getFullYear()}
          </p>

          {/* Right column — same grid as nav */}
          <div className="hidden items-center justify-between md:flex">
            <p className="text-[0.875rem] tracking-wide text-text-secondary">
              Designed by Slug Macro
            </p>

            {/* Back to top — aligned with dark mode toggle position */}
            <button
              onClick={scrollToTop}
              className="cursor-pointer text-[0.875rem] tracking-wide text-text-secondary transition-opacity duration-300 hover:opacity-60"
            >
              Back to top
            </button>
          </div>

          {/* Mobile: back to top */}
          <button
            onClick={scrollToTop}
            className="ml-auto cursor-pointer text-[0.875rem] tracking-wide text-text-secondary transition-opacity duration-300 hover:opacity-60 md:hidden"
          >
            Back to top
          </button>
        </div>
      </Container>
    </footer>
  )
}
