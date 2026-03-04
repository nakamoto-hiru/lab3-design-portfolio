import Container from '@/components/layout/Container'

interface ClientListProps {
  clients: string[]
}

export default function ClientList({ clients }: ClientListProps) {
  return (
    <section className="border-t border-border py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_3fr]">
          {/* Label */}
          <p className="text-[0.8125rem] tracking-wide text-text-secondary">
            Clients
          </p>

          {/* Client names */}
          <p className="text-[clamp(1.125rem,1.5vw,1.5rem)] leading-[1.15] font-light text-text-primary">
            {clients.join(', ')}
          </p>
        </div>
      </Container>
    </section>
  )
}
