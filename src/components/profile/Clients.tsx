interface ClientsProps {
  clients: string[]
}

export default function Clients({ clients }: ClientsProps) {
  if (clients.length === 0) return null

  return (
    <section className="border-t border-border py-12 sm:py-16 md:py-24">
      <div className="grid grid-cols-1 sm:grid-cols-4">
        <div className="px-6 sm:px-8 md:px-12">
          <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
            Clients
          </p>
        </div>
        <div className="col-span-1 mt-4 px-6 sm:col-span-2 sm:mt-0 sm:px-8 md:px-12">
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
      </div>
    </section>
  )
}
