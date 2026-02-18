import type { Metadata } from 'next'
import { Target, Eye, Users, Shield, Zap, Globe, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About – LocalBiz',
  description: 'Learn about our mission, vision, and the team behind LocalBiz.',
}

const highlights = [
  {
    Icon: Users,
    title: '2M+ Users',
    description: 'Millions of people use LocalBiz every month to discover trusted local businesses.',
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-900/30',
  },
  {
    Icon: Shield,
    title: 'Verified Reviews',
    description: 'Every review is authenticated to ensure you only see genuine experiences.',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    Icon: Zap,
    title: 'Real-time Data',
    description: 'Business hours, contact info, and status updated in real time by owners.',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    iconBg: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
  {
    Icon: Globe,
    title: '200+ Cities',
    description: 'Coverage across major cities in India, with new regions added every month.',
    iconColor: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-50 dark:bg-violet-900/20',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-background">

      {/* Hero */}
      <section className="relative py-24 overflow-hidden bg-linear-to-br from-blue-700 via-blue-600 to-sky-500">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <span className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-sm font-medium mb-6">
            Our Story
          </span>
          <h1
            className="font-extrabold text-4xl md:text-6xl mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
          >
            We&apos;re Building the<br />
            <span className="text-yellow-300">Future of Local Discovery</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            LocalBiz was founded with one simple belief: every great local business deserves to be discovered by the community it serves.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60V30C240 0 480 20 720 30C960 40 1200 10 1440 0V60H0Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">

            {/* Mission */}
            <div className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-100/60 dark:hover:shadow-blue-900/30 p-10 group transition-all duration-300">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-7 h-7" strokeWidth={1.75} />
              </div>
              <h2
                className="text-2xl font-bold text-foreground mb-4"
                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
              >
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To empower local businesses and communities by creating the most comprehensive, trustworthy, and accessible business discovery platform in India.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We believe that when people support local businesses, entire communities thrive. Our platform bridges the gap between curious customers and quality local services.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-100/60 dark:hover:shadow-blue-900/30 p-10 group transition-all duration-300">
              <div className="w-14 h-14 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-7 h-7" strokeWidth={1.75} />
              </div>
              <h2
                className="text-2xl font-bold text-foreground mb-4"
                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
              >
                Our Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A world where every local business — from the neighbourhood tea shop to the boutique fitness studio — has the same digital visibility as big-box retail chains.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We envision LocalBiz as the go-to platform for every Indian city, where locals discover, share, and celebrate businesses that define their communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-3"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              Why Choose Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We&apos;ve built LocalBiz from the ground up with a focus on trust, speed, and community.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map(({ Icon, title, description, iconColor, iconBg }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-100/60 dark:hover:shadow-blue-900/30 p-7 group transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <h3
                  className="font-bold text-foreground text-lg mb-2"
                  style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                >
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-6"
            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
          >
            Built with ❤️ for Local India
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Our team of passionate engineers, designers, and community managers work every day to make local discovery easier, faster, and more delightful for everyone.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all duration-200 hover:scale-[1.03]"
          >
            Get in Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}