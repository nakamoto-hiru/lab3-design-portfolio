const teamMembers = [
  {
    name: "Hieu Nguyen",
    role: "Creative Director",
    bio: "Former JoomlArt co-founder & design lead with 20 years in digital product design. Sets the creative vision and design strategy for every project — bridging business goals with user-centered thinking to shape products that resonate.",
    image: "/images/team/nakamoto.png",
  },
  {
    name: "Duc Le",
    role: "Lead Product Designer",
    bio: "Owns the end-to-end product design process — from user research and information architecture to high-fidelity UI systems and prototyping. Specializes in fintech, DeFi, and AI-native interfaces where complex data demands clarity.",
    image: "/images/team/slug.png",
  },
  {
    name: "Hien Nguyen",
    role: "Graphics Designer",
    bio: "A creative force with a sharp eye for aesthetics, color, and composition. Crafts visual identities, illustrations, and marketing collateral that translate brand stories into striking, memorable imagery across digital and print.",
    image: "/images/team/hazel.png",
  },
  {
    name: "Xuan Nguyen",
    role: "UI/UX Designer",
    bio: "Blends pixel-perfect interface craft with structured UX thinking — from user flows and wireframes to component libraries and design systems. Ensures every screen feels intuitive, consistent, and on-brand at any scale.",
    image: "/images/team/sophie.png",
  },
];

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
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 sm:gap-x-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="group flex flex-col">
                <div className="aspect-square w-full overflow-hidden bg-white">
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
                  <p className="mt-1 text-[0.75rem] tracking-wide text-text-secondary transition-colors duration-300 group-hover:text-accent">
                    {member.role}
                  </p>
                  <p className="mt-4 mb-2 text-[0.875rem] leading-[1.5] tracking-wide text-text-tertiary transition-colors duration-300 group-hover:text-text-primary">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
