import { useState, useCallback } from 'react'
import AnimatedSection from '@/components/common/AnimatedSection'
import ProjectCard from './ProjectCard'
import ProjectSidebar from './ProjectSidebar'
import { WireframePolyhedron } from '@/components/common/WireframeShapes'
import type { WorkFrontmatter } from '@/content/schema'

// Placeholder skeletons — fill subtitle/client/type/tags/role/content later.
function placeholder(slug: string, title: string, year: string): { data: WorkFrontmatter; content: string } {
  return {
    data: {
      slug,
      title,
      subtitle: 'TBD',
      year,
      client: 'TBD',
      type: 'TBD',
      tags: [],
      role: 'TBD',
      featured: false,
      galleryImages: [],
      galleryLayout: 'pattern',
      galleryTheme: 'dark',
    },
    content: 'TBD — short project intro.',
  }
}

const sideProjects: Array<{ data: WorkFrontmatter; content: string }> = [
  placeholder('alter-2025', 'Alter', '2025'),
  placeholder('gaimes-2025', 'Gaimes', '2025'),
  placeholder('bink-ai-2025', 'Bink AI', '2025'),
  placeholder('video-fi-2024', 'Video.Fi', '2024'),
  placeholder('gm-ai-2025', 'GM.AI', '2025'),
]

// Bento 3-col, all 1×1 squares — auto-flow:
//
// Cols:     1          2          3
// Row 1: [ Alter   ] [ Gaimes ] [ Bink AI ]
// Row 2: [ Video.Fi ] [ GM.AI ] [  deco   ]

const wireframeConfigs = [
  { detail: 0, speed: 0.7 },
]

export default function VibeCodeSection() {
  const [selected, setSelected] = useState<(typeof sideProjects)[number] | null>(null)
  const close = useCallback(() => setSelected(null), [])

  return (
    <section className="-mt-px border-t border-b border-border">
      <div
        className="grid grid-cols-1 bg-border sm:grid-cols-4"
        style={{ gap: '1px' }}
      >
        {/* Col 1: intro blurb */}
        <div className="bg-bg px-6 py-6 sm:px-8 sm:py-8 md:px-12 md:py-12">
          <p className="max-w-[30ch] text-[clamp(1.125rem,1.5vw,1.5rem)] leading-[1.4] font-light text-text-primary">
            Other works — projects outside the featured selection.
          </p>
        </div>

        {/* Cols 2-4: bento area (mobile stacks, desktop = 3-col checkerboard) */}
        <div className="col-span-1 sm:col-span-3">
          {/* Mobile: stacked square cards */}
          <div
            className="flex flex-col bg-border sm:hidden"
            style={{ gap: '1px' }}
          >
            {sideProjects.map((project, i) => (
              <AnimatedSection
                key={project.data.slug}
                delay={i * 0.06}
                className="aspect-square bg-bg"
              >
                <ProjectCard work={project} onClick={() => setSelected(project)} />
              </AnimatedSection>
            ))}
          </div>

          {/* Desktop: 3-col 1×1 bento (auto-flow) */}
          <div
            className="hidden bg-border sm:grid sm:grid-cols-3"
            style={{ gap: '1px' }}
          >
            {/* Project cells (4 × 1×1) */}
            {sideProjects.map((project, i) => (
              <AnimatedSection
                key={project.data.slug}
                delay={i * 0.06}
                className="aspect-square bg-bg"
              >
                <ProjectCard work={project} onClick={() => setSelected(project)} />
              </AnimatedSection>
            ))}

            {/* Decorative wireframe fillers (2 × 1×1) */}
            {wireframeConfigs.map((config, i) => (
              <div
                key={`deco-${i}`}
                className="aspect-square bg-bg"
              >
                <WireframePolyhedron detail={config.detail} speed={config.speed} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProjectSidebar work={selected} onClose={close} />
    </section>
  )
}
