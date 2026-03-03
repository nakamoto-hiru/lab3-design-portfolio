import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollLock } from '@/hooks/useScrollLock'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  links: { label: string; to: string }[]
  darkMode: boolean
  onToggleDark: () => void
}

export default function MobileMenu({ open, onClose, links, darkMode, onToggleDark }: MobileMenuProps) {
  useScrollLock(open)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col bg-bg"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-[0.667rem] py-4">
            <span className="text-[0.8125rem] tracking-wide text-text-primary">
              Slug Macro
            </span>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center"
              aria-label="Close menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-1 flex-col justify-center gap-8 px-[0.667rem]">
            {links.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
              >
                <Link
                  to={link.to}
                  onClick={onClose}
                  className="text-[clamp(2rem,5vw,3rem)] font-light text-text-primary"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Footer: dark mode toggle */}
          <div className="flex items-center gap-4 px-[0.667rem] py-6">
            <button
              onClick={onToggleDark}
              className="flex cursor-pointer items-center gap-1 text-[0.8125rem] text-text-secondary"
            >
              <span>Dark Mode</span>
              <span className="text-text-tertiary">
                [{darkMode ? 'Y' : 'N'}]
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
