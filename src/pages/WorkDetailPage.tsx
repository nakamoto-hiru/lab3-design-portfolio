import { useParams, Navigate } from 'react-router-dom'
import AnimatedSection from '@/components/common/AnimatedSection'
import { getWorkBySlug } from '@/content/loader'
import WorkHero from '@/components/work/WorkHero'
import WorkGallery from '@/components/work/WorkGallery'
import WorkContent from '@/components/work/WorkContent'
import WorkNav from '@/components/work/WorkNav'
import { useImageTheme } from '@/hooks/useImageTheme'

export default function WorkDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const work = getWorkBySlug(slug ?? '')
  useImageTheme(work?.data.heroImage)

  if (!work) return <Navigate to="/" replace />

  return (
    <>
      <AnimatedSection>
        <WorkHero data={work.data} content={work.content} />
      </AnimatedSection>
      <AnimatedSection delay={0.1}>
        <WorkContent content={work.content} />
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <WorkGallery data={work.data} />
      </AnimatedSection>
      <WorkNav currentSlug={work.data.slug} />
    </>
  )
}
