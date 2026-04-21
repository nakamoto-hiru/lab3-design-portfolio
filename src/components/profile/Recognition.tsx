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
    <section className="border-t border-border py-12 sm:py-16 md:py-24">
      <div className="grid grid-cols-1 sm:grid-cols-4">
        <div className="px-6 sm:px-8 md:px-12">
          <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
            Recognition
          </p>
        </div>
        <div className="col-span-1 mt-4 px-6 sm:col-span-2 sm:mt-0 sm:px-8 md:px-12">
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
      </div>
    </section>
  )
}
