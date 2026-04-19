import Container from '@/components/layout/Container'

const vibeProjects = [
  {
    title: 'Portfolio Terminal',
    description: 'This portfolio — ASCII art, parallax, scramble animations. Built entirely with AI pair programming.',
    stack: 'React · Tailwind · Framer Motion',
  },
  {
    title: 'AI Chat Interface',
    description: 'Conversational UI with streaming responses, markdown rendering, and code highlighting.',
    stack: 'Next.js · OpenAI · Vercel AI SDK',
  },
  {
    title: 'Design Token Generator',
    description: 'Tool that extracts design tokens from Figma and generates Tailwind config automatically.',
    stack: 'TypeScript · Figma API · Node.js',
  },
  {
    title: 'Data Dashboard',
    description: 'Real-time analytics dashboard with interactive charts and natural language queries.',
    stack: 'React · D3.js · Claude API',
  },
]

export default function VibeCodeSection() {
  return (
    <section className="border-t border-border py-12">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_3fr] md:gap-0">
          {/* Left: sticky section label */}
          <div className="self-start sticky top-16">
            <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
              Vibe code
            </p>
          </div>

          {/* Right: project list */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {vibeProjects.map((project) => (
              <div
                key={project.title}
                className="group border border-border p-5 transition-colors duration-300 hover:border-text-tertiary"
              >
                <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
                  {project.title}
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed tracking-wide text-text-secondary">
                  {project.description}
                </p>
                <p className="mt-4 text-[0.75rem] tracking-wide text-text-tertiary">
                  {project.stack}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
