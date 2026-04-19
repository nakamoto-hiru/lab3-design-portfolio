import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAsciiScramble } from '@/hooks/useAsciiScramble'
import MobileMenu from './MobileMenu'
import Container from './Container'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { label: 'Information', to: '/profile' },
  { label: 'Projects', to: '/' },
]

const ASCII_LOGO = `███████╗██╗     ██╗   ██╗ ██████╗
██╔════╝██║     ██║   ██║██╔════╝
███████╗██║     ██║   ██║██║  ███╗
╚════██║██║     ██║   ██║██║   ██║
███████║███████╗╚██████╔╝╚██████╔╝
╚══════╝╚══════╝ ╚═════╝  ╚═════╝
███╗   ███╗ █████╗  ██████╗██████╗  ██████╗
████╗ ████║██╔══██╗██╔════╝██╔══██╗██╔═══██╗
██╔████╔██║███████║██║     ██████╔╝██║   ██║
██║╚██╔╝██║██╔══██║██║     ██╔══██╗██║   ██║
██║ ╚═╝ ██║██║  ██║╚██████╗██║  ██║╚██████╔╝
╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝`

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scaleX, setScaleX] = useState(1)
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined)
  const { display, scramble, reset } = useAsciiScramble(ASCII_LOGO, 1000)
  const logoSectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: logoSectionRef,
    offset: ['start start', 'end start'],
  })
  const logoOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0], { clamp: true })

  const fitToWidth = useCallback(() => {
    if (preRef.current && wrapperRef.current) {
      const containerW = wrapperRef.current.offsetWidth
      const textW = preRef.current.scrollWidth
      const textH = preRef.current.scrollHeight
      if (textW > 0) {
        const s = containerW / textW
        setScaleX(s)
        setScaledHeight(textH * s)
      }
    }
  }, [])

  useEffect(() => {
    fitToWidth()
    document.fonts.ready.then(fitToWidth)
    window.addEventListener('resize', fitToWidth)
    return () => window.removeEventListener('resize', fitToWidth)
  }, [fitToWidth])

  return (
    <>
      {/* ASCII Logo — fixed, content scrolls over it */}
      <div
        ref={logoSectionRef as React.RefObject<HTMLDivElement>}
        className="relative"
        style={{ height: scaledHeight ? scaledHeight - 40 : undefined }}
      >
        <div className="fixed top-0 left-0 z-0 w-full max-w-[var(--container-max)]">
          <Container>
            <Link to="/" aria-label="Slug Macro — Home" className="block">
              <motion.div className="overflow-hidden pt-12" style={{ opacity: logoOpacity }}>
                <div
                  ref={wrapperRef as React.RefObject<HTMLDivElement>}
                  className="w-full overflow-hidden cursor-pointer"
                  style={{ height: scaledHeight }}
                  onMouseEnter={scramble}
                  onMouseLeave={reset}
                >
                  <pre
                    ref={preRef as React.RefObject<HTMLPreElement>}
                    className="select-none leading-[1.15] text-text-primary"
                    style={{
                      fontFamily: "monospace",
                      fontSize: '1rem',
                      transform: `scale(${scaleX})`,
                      transformOrigin: 'left top',
                      whiteSpace: 'pre',
                      width: 'fit-content',
                    }}
                  >{display}</pre>
                </div>
              </motion.div>
            </Link>
          </Container>
        </div>
      </div>

      {/* Nav bar — sticky top */}
      <header className="sticky top-0 z-50 w-full bg-bg border-t border-border">
        <Container>
          <nav className="grid grid-cols-2 gap-4 py-4 md:grid-cols-4">
            <div className="text-[0.75rem] leading-relaxed tracking-wide text-text-secondary">
              <span className="block">Independent</span>
              <span className="block">Designer</span>
            </div>

            <div className="hidden text-[0.75rem] leading-relaxed tracking-wide md:block">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'block transition-opacity duration-300 hover:opacity-60',
                    location.pathname === link.to
                      ? 'text-text-primary font-medium'
                      : 'text-text-secondary'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            <div className="hidden text-right text-[0.75rem] leading-relaxed tracking-wide text-text-tertiary md:block">
              <span className="block">2025</span>
              <span className="block">Portfolio</span>
            </div>

            <button
              onClick={() => setMenuOpen(true)}
              className="ml-auto flex h-8 w-8 items-center justify-center md:hidden"
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </nav>
        </Container>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={navLinks}
      />
    </>
  )
}
