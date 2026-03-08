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
    <section className="pt-16 pb-16 md:pt-24 md:pb-24">
      <Container>
        <div className="space-y-10">
          {bodySections.map((section, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_3fr] md:gap-0"
            >
              {/* Left: heading */}
              <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
                {section.heading}
              </p>

              {/* Right: content */}
              <div>
                {section.items.length > 0 ? (
                  <ul className="space-y-2">
                    {section.items.map((item, j) => (
                      <li
                        key={j}
                        className="text-[0.875rem] leading-[1.6] text-text-primary"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[0.875rem] leading-[1.6] text-text-primary">
                    {section.text}
                  </p>
                )}
              </div>
            </div>
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
