import { Fragment } from 'react'
import Container from '@/components/layout/Container'

interface WorkContentProps {
  content: string
}

export default function WorkContent({ content }: WorkContentProps) {
  const sections = parseMarkdown(content)

  // Skip the intro paragraph (already shown in hero)
  const bodySections = sections.filter((s) => s.heading)

  if (bodySections.length === 0) return null

  return (
    <section className="pt-10 pb-10 sm:pt-14 sm:pb-14 md:pt-20 md:pb-8 lg:pt-24 lg:pb-8">
      <Container>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[1fr_1px_1fr]">
          {bodySections.map((section, i) => (
            <Fragment key={i}>
              {i > 0 && (
                <div className="hidden md:block bg-border" />
              )}
              <div>
                <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
                  {section.heading}
                </p>
                <div className="mt-4">
                  {section.items.length > 0 ? (
                    <ul className="space-y-2">
                      {section.items.map((item, j) => (
                        <li
                          key={j}
                          className="text-[0.875rem] leading-[1.6] text-text-secondary"
                        >
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
            </Fragment>
          ))}
        </div>
      </Container>
    </section>
  )
}

interface Section {
  heading?: string
  text: string
  items: string[]
}

function parseMarkdown(md: string): Section[] {
  const sections: Section[] = []
  let current: Section = { text: '', items: [] }

  const lines = md.split('\n')
  for (const line of lines) {
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
