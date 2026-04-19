import Container from '@/components/layout/Container'

interface ClientsProps {
  clients: string[]
}

export default function Clients({ clients }: ClientsProps) {
  if (clients.length === 0) return null

  return (
    <section className="mt-16 md:mt-24">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_3fr] md:gap-0">
          <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
            Clients
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {clients.map((client) => (
              <span
                key={client}
                className="text-[0.875rem] tracking-wide text-text-secondary"
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
