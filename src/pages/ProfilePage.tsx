import AnimatedSection from '@/components/common/AnimatedSection'
import ProfileHero from '@/components/profile/ProfileHero'
import TeamMembers from '@/components/profile/TeamMembers'
import Services from '@/components/profile/Services'
import Clients from '@/components/profile/Clients'
import InfoPanel from '@/components/profile/InfoPanel'
import { getProfile } from '@/content/loader'

export default function ProfilePage() {
  const profile = getProfile()

  return (
    <>
      <AnimatedSection>
        <ProfileHero content={profile.content} />
      </AnimatedSection>
      <AnimatedSection delay={0.1}>
        <TeamMembers />
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <Services services={profile.data.services} />
      </AnimatedSection>
      {profile.data.clients.length > 0 && (
        <AnimatedSection delay={0.3}>
          <Clients clients={profile.data.clients} />
        </AnimatedSection>
      )}
      <AnimatedSection delay={0.4}>
        <InfoPanel data={profile.data} />
      </AnimatedSection>
    </>
  )
}
