import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { WorkFrontmatter } from '@/content/schema'

interface ProjectSidebarProps {
  work: { data: WorkFrontmatter; content: string } | null
  onClose: () => void
}

interface Section {
  heading?: string
  text: string
  items: string[]
}

function parseMarkdown(md: string): Section[] {
  const sections: Section[] = []
  let current: Section = { text: '', items: [] }

  for (const line of md.split('\n')) {
    if (line.startsWith('## ')) {
      if (current.text || current.items.length > 0 || current.heading) {
        sections.push(current)
      }
      current = { heading: line.replace('## ', ''), text: '', items: [] }
    } else if (line.startsWith('- ')) {
      current.items.push(line.replace('- ', ''))
    } else if (line.trim()) {
      current.text += (current.text ? ' ' : '') + line.trim()
    }
  }

  if (current.text || current.items.length > 0 || current.heading) {
    sections.push(current)
  }

  return sections
}

export default function ProjectSidebar({ work, onClose }: ProjectSidebarProps) {
  useEffect(() => {
    if (work) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [work])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const sections = work ? parseMarkdown(work.content) : []
  const intro = sections.find((s) => !s.heading)
  const bodySections = sections.filter((s) => s.heading)

  return createPortal(
    <AnimatePresence>
      {work && (
        <>
          {/* Clip container — constrains sidebar within max-width */}
          <div
            className="fixed top-0 left-0 bottom-0 z-[60] overflow-hidden"
            style={{ width: 'min(var(--container-max), 100vw)' }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute top-0 right-0 bottom-0 w-full overflow-y-auto bg-bg border-l border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:w-[75%]"
            >
            {/* Close */}
            <div className="sticky top-0 z-10 flex justify-end bg-bg">
              <button
                onClick={onClose}
                className="group flex h-12 w-12 items-center justify-center border-l border-b border-border text-text-tertiary transition-colors hover:text-text-primary cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-500 ease-out group-hover:rotate-[360deg]">
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 pb-16 sm:px-8 md:px-12">
              {/* Title */}
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.1] tracking-tight text-text-primary">
                {work.data.title}
              </h2>

              {/* Intro */}
              {intro && (
                <p className="mt-4 max-w-[55ch] text-[clamp(1rem,1.2vw,1.25rem)] leading-[1.5] font-light text-text-primary">
                  {intro.text}
                </p>
              )}

              {/* Meta */}
              <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-t border-border pt-8">
                <div>
                  <p className="text-[0.75rem] tracking-wide text-text-tertiary">Year</p>
                  <p className="mt-1 text-[0.875rem] text-text-primary">{work.data.year}</p>
                </div>
                <div>
                  <p className="text-[0.75rem] tracking-wide text-text-tertiary">Client</p>
                  <p className="mt-1 text-[0.875rem] text-text-primary">{work.data.client}</p>
                </div>
                <div>
                  <p className="text-[0.75rem] tracking-wide text-text-tertiary">Role</p>
                  <p className="mt-1 text-[0.875rem] text-text-primary">{work.data.role}</p>
                </div>
                <div>
                  <p className="text-[0.75rem] tracking-wide text-text-tertiary">Type</p>
                  <p className="mt-1 text-[0.875rem] text-text-primary">{work.data.type}</p>
                </div>
              </div>

              {/* Content sections */}
              {bodySections.length > 0 && (
                <div className="mt-12 space-y-10">
                  {bodySections.map((section, i) => (
                    <div key={i} className="border-t border-border pt-8">
                      <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
                        {section.heading}
                      </p>
                      <div className="mt-4">
                        {section.items.length > 0 ? (
                          <ul className="space-y-2">
                            {section.items.map((item, j) => (
                              <li key={j} className="text-[0.875rem] leading-[1.6] text-text-secondary">
                                {item}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[0.875rem] leading-[1.6] text-text-secondary">
                            {section.text}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Gallery placeholders */}
              <div className="mt-12 space-y-4">
                <div className="aspect-[8/5] w-full bg-bg-secondary" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-[4/5] bg-bg-secondary" />
                  <div className="aspect-[4/5] bg-bg-secondary" />
                </div>
              </div>

            </div>
          </motion.aside>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
