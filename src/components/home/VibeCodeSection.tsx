import { useState, useCallback } from 'react'
import AnimatedSection from '@/components/common/AnimatedSection'
import ProjectSidebar from './ProjectSidebar'
import type { WorkFrontmatter } from '@/content/schema'

const sideProjects: Array<{ data: WorkFrontmatter; content: string }> = [
  {
    data: {
      slug: 'portfolio-terminal',
      title: 'Portfolio Terminal',
      subtitle: 'Personal portfolio with terminal aesthetics',
      year: '2026',
      client: 'Personal',
      type: 'Side Project',
      tags: ['React', 'Tailwind', 'Framer Motion'],
      role: 'Design & Development',
      featured: false,
      galleryImages: [],
      galleryLayout: 'pattern',
    },
    content: `ASCII art, parallax scrolling, scramble animations — built entirely with AI pair programming.

## Scope

- Designed and built a portfolio site with terminal-inspired aesthetics
- Implemented ASCII logo with hover scramble effect
- Built bento grid layout with checkerboard pattern
- Created smooth scroll interactions and sticky header

## Stack

- React 19 + TypeScript + Vite 7
- Tailwind CSS v4
- Framer Motion for animations
- Deployed on Vercel`,
  },
  {
    data: {
      slug: 'ai-chat-interface',
      title: 'AI Chat Interface',
      subtitle: 'Conversational UI experiment',
      year: '2025',
      client: 'Personal',
      type: 'Experiment',
      tags: ['Next.js', 'OpenAI', 'Vercel AI SDK'],
      role: 'Design & Development',
      featured: false,
      galleryImages: [],
      galleryLayout: 'pattern',
    },
    content: `Conversational UI with streaming responses, markdown rendering, and code highlighting.

## Scope

- Built a chat interface with real-time streaming responses
- Implemented markdown rendering with syntax highlighting
- Designed conversation threading and context management
- Explored prompt engineering patterns for better UX`,
  },
  {
    data: {
      slug: 'design-token-generator',
      title: 'Design Token Generator',
      subtitle: 'Figma to Tailwind pipeline',
      year: '2025',
      client: 'Personal',
      type: 'Tool',
      tags: ['TypeScript', 'Figma API', 'Node.js'],
      role: 'Development',
      featured: false,
      galleryImages: [],
      galleryLayout: 'pattern',
    },
    content: `Tool that extracts design tokens from Figma and generates Tailwind config automatically.

## Scope

- Built a CLI tool to extract colors, typography, and spacing from Figma files
- Generates Tailwind CSS config with semantic naming
- Supports theme variants and responsive tokens
- Automates the design-to-code handoff process`,
  },
  {
    data: {
      slug: 'data-dashboard',
      title: 'Data Dashboard',
      subtitle: 'Analytics with natural language queries',
      year: '2025',
      client: 'Personal',
      type: 'Experiment',
      tags: ['React', 'D3.js', 'Claude API'],
      role: 'Design & Development',
      featured: false,
      galleryImages: [],
      galleryLayout: 'pattern',
    },
    content: `Real-time analytics dashboard with interactive charts and natural language queries.

## Scope

- Designed interactive data visualizations with D3.js
- Integrated Claude API for natural language data queries
- Built real-time data streaming with WebSocket connections
- Explored conversational analytics UX patterns`,
  },
]

export default function VibeCodeSection() {
  const [selected, setSelected] = useState<(typeof sideProjects)[number] | null>(null)
  const close = useCallback(() => setSelected(null), [])

  return (
    <section className="-mt-px border-t border-b border-border">
      <div className="grid grid-cols-1 sm:grid-cols-4">
        {/* Col 1: intro blurb */}
        <div className="px-8 py-12 sm:border-r sm:border-border sm:px-12">
          <p className="max-w-[30ch] text-[clamp(1.125rem,1.5vw,1.5rem)] leading-[1.4] font-light text-text-primary">
            Things I build after hours — experiments, tools, and ideas that keep the craft sharp.
          </p>
        </div>

        {/* Cols 2-4: project list */}
        <div className="col-span-1 flex flex-col sm:col-span-3">
          {sideProjects.map((project, i) => (
            <AnimatedSection key={project.data.slug} delay={i * 0.06}>
              <div
                onClick={() => setSelected(project)}
                className={`group relative flex cursor-pointer flex-col justify-end px-8 py-12 transition-colors duration-300 hover:bg-bg-secondary sm:px-12${i < sideProjects.length - 1 ? ' border-b border-border' : ''}`}
              >
                <span className="text-[0.875rem] font-medium tracking-wide text-text-primary transition-colors duration-300 group-hover:text-accent">
                  {project.data.title}
                </span>
                <span className="mt-1 text-[0.75rem] tracking-wide text-text-secondary">
                  {project.content.split('\n')[0]}
                </span>
                <span className="mt-3 text-[0.7rem] tracking-wide text-text-tertiary">
                  {project.data.tags.join(' · ')}
                </span>

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="absolute right-8 top-12 -translate-x-2 scale-100 text-accent opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:scale-[4] group-hover:opacity-100 sm:right-12"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      <ProjectSidebar work={selected} onClose={close} />
    </section>
  )
}
