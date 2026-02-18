import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import Categories from '@/components/sections/Categories'
import HowItWorks from '@/components/sections/HowItWorks'
import Testimonials from '@/components/sections/Testimonials'
import CtaSection from '@/components/sections/CtaSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Categories />
      <HowItWorks />
      <Testimonials />
      <CtaSection />
    </>
  )
}