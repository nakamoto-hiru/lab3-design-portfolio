import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAsciiScramble } from '@/hooks/useAsciiScramble'
import MobileMenu from './MobileMenu'

const navLinks = [
  { label: 'Projects', to: '/' },
  { label: 'Information', to: '/profile' },
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
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(entry.intersectionRatio < 1),
      { threshold: [1], rootMargin: '-1px 0px 0px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
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
          <div className="px-8 sm:px-12">
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
          </div>
        </div>
      </div>

      {/* Nav bar — sticky top */}
      <header ref={headerRef as React.RefObject<HTMLElement>} className={cn('sticky top-0 z-50 w-full bg-bg border-t border-border transition-[border-color] duration-300', scrolled ? 'border-b border-b-border' : 'border-b border-b-transparent')}>
        <nav className="grid grid-cols-2 sm:grid-cols-4 [&>div]:transition-[padding] [&>div]:duration-300">
          <div className={cn('px-8 text-[0.875rem] leading-relaxed tracking-wide text-text-secondary sm:px-12', scrolled ? 'py-6' : 'py-12')}>
            Independent Designer
          </div>

          <div className={cn('hidden px-12 text-[0.875rem] leading-relaxed tracking-wide sm:block', scrolled ? 'py-6' : 'py-12')}>
            <Link
              to="/"
              className={cn(
                'transition-opacity duration-300 hover:opacity-60',
                location.pathname === '/'
                  ? 'text-text-primary font-medium'
                  : 'text-text-secondary'
              )}
            >
              Projects
            </Link>
          </div>

          <div className={cn('hidden px-12 text-[0.875rem] leading-relaxed tracking-wide sm:block', scrolled ? 'py-6' : 'py-12')}>
            <Link
              to="/profile"
              className={cn(
                'transition-opacity duration-300 hover:opacity-60',
                location.pathname === '/profile'
                  ? 'text-text-primary font-medium'
                  : 'text-text-secondary'
              )}
            >
              Information
            </Link>
          </div>

          <div className={cn('hidden px-12 text-right text-[0.875rem] leading-relaxed tracking-wide text-text-tertiary sm:block', scrolled ? 'py-6' : 'py-12')}>
            <span>2026 Portfolio — V.2.1.0</span>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="ml-auto flex h-8 w-8 items-center justify-center px-8 sm:hidden"
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={navLinks}
      />
    </>
  )
}
