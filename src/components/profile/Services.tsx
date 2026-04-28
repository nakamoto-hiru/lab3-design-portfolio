interface ServicesProps {
  services: string[]
}

export default function Services({ services }: ServicesProps) {
  return (
    <section className="border-t border-border py-12 sm:py-16 md:py-24">
      <div className="grid grid-cols-1 sm:grid-cols-4">
        <div className="px-6 sm:px-8 md:px-12">
          <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
            Services
          </p>
        </div>

        <div className="col-span-1 mt-4 px-6 sm:col-span-2 sm:mt-0 sm:px-8 md:px-12">
          <div className="space-y-3">
            {services.map((service) => (
              <p
                key={service}
                className="text-[clamp(1.125rem,1.5vw,1.5rem)] leading-[1.4] font-light text-text-primary"
              >
                {service}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
