import Container from '@/components/layout/Container'

interface RecognitionItem {
  title: string
  org: string
  year?: string
}

interface RecognitionProps {
  recognition: RecognitionItem[]
}

export default function Recognition({ recognition }: RecognitionProps) {
  if (recognition.length === 0) return null

  return (
    <section className="mt-16 md:mt-24">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_3fr] md:gap-0">
          <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
            Recognition
          </p>
          <div className="space-y-4">
            {recognition.map((item, i) => (
              <div
                key={i}
                className={`flex items-baseline justify-between pb-4${i < recognition.length - 1 ? ' border-b border-border' : ''}`}
              >
                <div>
                  <span className="text-[0.875rem] tracking-wide text-text-primary">
                    {item.title}
                  </span>
                  <span className="ml-2 text-[0.875rem] tracking-wide text-text-secondary">
                    — {item.org}
                  </span>
                </div>
                {item.year && (
                  <span className="text-[0.75rem] tabular-nums tracking-wide text-text-tertiary">
                    {item.year}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
