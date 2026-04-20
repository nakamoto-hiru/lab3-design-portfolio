import { useState, useCallback } from 'react'
import AnimatedSection from '@/components/common/AnimatedSection'
import ProjectCard from './ProjectCard'
import ProjectSidebar from './ProjectSidebar'
import type { WorkFrontmatter } from '@/content/schema'

// All 1:1. 50% = 2×2 block. 25% = 1×1.
// 4 cols × 5 rows checkerboard layout:
//
// Col:    1          2          3          4
// Row 1: [WM 2×2  ] [WM      ] [GeoRep  ] [        ]
// Row 2: [WM      ] [WM      ] [MN 2×2  ] [MN      ]
// Row 3: [        ] [        ] [MN      ] [MN      ]
// Row 4: [        ] [WP 2×2  ] [WP      ] [WMob    ]
// Row 5: [W.Fund  ] [WP      ] [WP      ] [JoomlArt]

interface Placement {
  workIndex: number
  col: number
  row: number
  span: number
}

// Sorted order: 0=WM, 1=WP, 2=MN, 3=GR, 4=WF, 5=WMob, 6=JA
const placements: Placement[] = [
  { workIndex: 0, col: 1, row: 1, span: 2 }, // Whales Market 50%
  { workIndex: 3, col: 3, row: 1, span: 1 }, // GeoReport 25%
  { workIndex: 2, col: 3, row: 2, span: 2 }, // Mention Network 50%
  { workIndex: 1, col: 2, row: 4, span: 2 }, // Whales Predict 50%
  { workIndex: 4, col: 1, row: 4, span: 1 }, // Whales Fund 25%
  { workIndex: 5, col: 4, row: 4, span: 1 }, // Whales Mobile 25%
  { workIndex: 6, col: 4, row: 5, span: 1 }, // JoomlArt 25%
]

// Fill remaining cells as empty decorative squares
const emptyCells: Array<{ col: number; row: number }> = []
const occupied = new Set<string>()
for (const p of placements) {
  for (let c = 0; c < p.span; c++) {
    for (let r = 0; r < p.span; r++) {
      occupied.add(`${p.col + c},${p.row + r}`)
    }
  }
}
for (let row = 1; row <= 5; row++) {
  for (let col = 1; col <= 4; col++) {
    if (!occupied.has(`${col},${row}`)) {
      emptyCells.push({ col, row })
    }
  }
}

interface FeaturedGridProps {
  work: Array<{ data: WorkFrontmatter; content: string }>
}

export default function FeaturedGrid({ work }: FeaturedGridProps) {
  const [selected, setSelected] = useState<{ data: WorkFrontmatter; content: string } | null>(null)
  const close = useCallback(() => setSelected(null), [])

  return (
    <section id="featured-work">
      <div
        className="grid border-b border-border bg-border sm:grid-cols-4"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(5, auto)',
          gap: '1px',
        }}
      >
        {/* Empty decorative cells */}
        {emptyCells.map((cell) => (
          <div
            key={`e-${cell.col}-${cell.row}`}
            className="aspect-square bg-bg"
            style={{
              gridColumn: `${cell.col} / ${cell.col + 1}`,
              gridRow: `${cell.row} / ${cell.row + 1}`,
            }}
          />
        ))}

        {/* Project cells */}
        {placements.map((p, i) => {
          const w = work[p.workIndex]
          if (!w) return null
          return (
            <AnimatedSection
              key={w.data.slug}
              delay={i * 0.08}
              className="aspect-square bg-bg"
              style={{
                gridColumn: `${p.col} / ${p.col + p.span}`,
                gridRow: `${p.row} / ${p.row + p.span}`,
              }}
            >
              <ProjectCard work={w} onClick={() => setSelected(w)} />
            </AnimatedSection>
          )
        })}
      </div>

      <ProjectSidebar work={selected} onClose={close} />
    </section>
  )
}
