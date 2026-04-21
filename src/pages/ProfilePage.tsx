import AnimatedSection from '@/components/common/AnimatedSection'
import ProfileHero from '@/components/profile/ProfileHero'
import InfoPanel from '@/components/profile/InfoPanel'
import Skills from '@/components/profile/Skills'
import Experience from '@/components/profile/Experience'
import { getProfile } from '@/content/loader'

export default function ProfilePage() {
  const profile = getProfile()

  return (
    <>
      <AnimatedSection>
        <ProfileHero content={profile.content} />
      </AnimatedSection>
      <AnimatedSection delay={0.1}>
        <InfoPanel data={profile.data} />
      </AnimatedSection>
      {profile.data.skills && (
        <AnimatedSection delay={0.2}>
          <Skills skills={profile.data.skills} />
        </AnimatedSection>
      )}
      <AnimatedSection delay={0.3}>
        <Experience experience={profile.data.experience} />
      </AnimatedSection>
    </>
  )
}
