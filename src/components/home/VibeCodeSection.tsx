import { useState, useCallback } from 'react'
import AnimatedSection from '@/components/common/AnimatedSection'
import ProjectCard from './ProjectCard'
import ProjectSidebar from './ProjectSidebar'
import { WireframePolyhedron } from '@/components/common/WireframeShapes'
import { getWorkBySlug } from '@/content/loader'
import type { WorkFrontmatter } from '@/content/schema'

const SIDE_PROJECT_SLUGS = ['alter', 'gaimes', 'bink-ai', 'video-fi'] as const

const sideProjects = SIDE_PROJECT_SLUGS.map((slug) => getWorkBySlug(slug)).filter(
  (w): w is { data: WorkFrontmatter; content: string } => w !== null,
)

// Bento 3-col, all 1×1 squares — interlocked deco placement:
//
// Cols:     1          2          3
// Row 1: [ Alter   ] [ deco-1 ] [ Bink AI ]
// Row 2: [ Gaimes  ] [ Video.Fi ] [ deco-2 ]

type DesktopCell =
  | { kind: 'project'; project: (typeof sideProjects)[number] }
  | { kind: 'deco'; config: { detail: number; speed: number } }

const wireframeConfigs = [
  { detail: 0, speed: 0.7 },
  { detail: 1, speed: 0.45 },
]

const desktopCells: DesktopCell[] = [
  { kind: 'project', project: sideProjects[0] }, // Alter
  { kind: 'deco', config: wireframeConfigs[0] },
  { kind: 'project', project: sideProjects[2] }, // Bink AI
  { kind: 'project', project: sideProjects[1] }, // Gaimes
  { kind: 'project', project: sideProjects[3] }, // Video.Fi
  { kind: 'deco', config: wireframeConfigs[1] },
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

          {/* Desktop: 3-col 1×1 bento (explicit order — projects + deco interlocked) */}
          <div
            className="hidden bg-border sm:grid sm:grid-cols-3"
            style={{ gap: '1px' }}
          >
            {desktopCells.map((cell, i) =>
              cell.kind === 'project' ? (
                <AnimatedSection
                  key={cell.project.data.slug}
                  delay={i * 0.06}
                  className="aspect-square bg-bg"
                >
                  <ProjectCard
                    work={cell.project}
                    onClick={() => setSelected(cell.project)}
                  />
                </AnimatedSection>
              ) : (
                <div key={`deco-${i}`} className="aspect-square bg-bg">
                  <WireframePolyhedron
                    detail={cell.config.detail}
                    speed={cell.config.speed}
                  />
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <ProjectSidebar work={selected} onClose={close} />
    </section>
  )
}
