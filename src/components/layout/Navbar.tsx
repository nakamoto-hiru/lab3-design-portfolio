import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useState } from 'react'
import MobileMenu from './MobileMenu'
import Container from './Container'

const navLinks = [
  { label: 'Work', to: '/' },
  { label: 'Profile', to: '/profile' },
]

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-sm">
        <Container>
          <nav className="grid grid-cols-[1fr_auto] items-center py-4 md:grid-cols-[1fr_3fr]">
            {/* Logo */}
            <Link
              to="/"
              className="text-[0.875rem] font-medium tracking-wide text-text-primary"
            >
              Slug Macro
            </Link>

            {/* Desktop nav — aligned to hero right column */}
            <div className="hidden items-center justify-between md:flex">
              <div className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      'text-[0.875rem] tracking-wide transition-opacity duration-300 hover:opacity-60',
                      location.pathname === link.to
                        ? 'text-text-primary'
                        : 'text-text-secondary'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

            </div>

            {/* Mobile menu button */}
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
