const teamMembers = [
  {
    name: 'Hiru Nakamoto',
    role: 'Creative Director',
    bio: 'Sets the creative vision and design strategy for every project. Bridges business goals with user-centered thinking to shape products that resonate.',
    image: '/images/team/nakamoto.svg',
    linkedin: 'https://linkedin.com/in/',
  },
  {
    name: 'Slug Macro',
    role: 'Lead Product Designer',
    bio: 'Owns the end-to-end product design process — from research and architecture to high-fidelity UI systems. Specializes in fintech and AI-native interfaces.',
    image: '/images/team/member-2.svg',
    linkedin: 'https://linkedin.com/in/slugmacro',
  },
  {
    name: 'Hazel Taylor',
    role: 'Senior UX Designer',
    bio: 'Drives user research, interaction flows, and usability testing. Turns complex data into clear, intuitive experiences across web and mobile platforms.',
    image: '/images/team/member-3.svg',
    linkedin: 'https://linkedin.com/in/',
  },
  {
    name: 'Sophie Bulock',
    role: 'UI Designer',
    bio: 'Crafts pixel-perfect interfaces, component libraries, and visual systems. Ensures every detail aligns with the design language and brand identity.',
    image: '/images/team/member-4.svg',
    linkedin: 'https://linkedin.com/in/',
  },
]

export default function TeamMembers() {
  return (
    <section className="border-t border-border py-12 sm:py-16 md:py-24">
      <div className="grid grid-cols-1 sm:grid-cols-4">
        <div className="px-6 sm:px-8 md:px-12">
          <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
            Team
          </p>
        </div>

        <div className="col-span-1 mt-4 px-6 sm:col-span-3 sm:mt-0 sm:px-8 md:px-12">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="flex flex-col">
                <div className="aspect-[3/4] w-full overflow-hidden bg-bg-secondary">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="mt-6">
                  <p className="text-[0.875rem] font-medium tracking-wide text-text-primary">
                    {member.name}
                  </p>
                  <p className="mt-1 text-[0.75rem] tracking-wide text-text-secondary">
                    {member.role}
                  </p>
                  <p className="mt-4 mb-2 text-[0.875rem] leading-[1.5] tracking-wide text-text-tertiary">
                    {member.bio}
                  </p>
                </div>

                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-[0.875rem] tracking-wide text-text-primary underline decoration-accent underline-offset-4 transition-opacity hover:opacity-60"
                >
                  LinkedIn
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
