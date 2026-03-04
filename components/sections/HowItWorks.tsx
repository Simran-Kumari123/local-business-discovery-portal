import { Search, Map, MessageSquare } from 'lucide-react'

const steps = [
  {
    Icon: Search,
    step: '01',
    title: 'Search',
    description: "Type what you're looking for. Use filters like location, category, rating, or hours to narrow down the best options for you.",
    bgColor: 'bg-blue-600',
    ringColor: 'ring-blue-200 dark:ring-blue-900',
  },
  {
    Icon: Map,
    step: '02',
    title: 'Explore',
    description: 'Browse detailed business profiles, photos, hours, contact info, and real customer reviews to find your perfect match.',
    bgColor: 'bg-sky-500',
    ringColor: 'ring-sky-200 dark:ring-sky-900',
  },
  {
    Icon: MessageSquare,
    step: '03',
    title: 'Review',
    description: 'Share your experience and help your community make better choices. Your review matters and builds local trust.',
    bgColor: 'bg-indigo-600',
    ringColor: 'ring-indigo-200 dark:ring-indigo-900',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4 border border-border">
            How It Works
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
          >
            Start in 3 Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started with LocalBiz is fast, free, and easy. No sign-up required to browse.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">

          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-0.5 bg-linear-to-r from-blue-200 via-sky-200 to-indigo-200 dark:from-blue-800 dark:via-sky-800 dark:to-indigo-800 z-0" />

          <div className="grid md:grid-cols-3 gap-10 relative z-10">
            {steps.map(({ Icon, step, title, description, bgColor, ringColor }) => (
              <div key={title} className="flex flex-col items-center text-center">

                {/* Icon circle */}
                <div className={`w-20 h-20 rounded-full ${bgColor} flex items-center justify-center mb-6 shadow-lg ring-4 ${ringColor} hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-9 h-9 text-white" strokeWidth={1.75} />
                </div>

                <p className="text-xs font-bold tracking-widest text-muted-foreground mb-2 uppercase">
                  Step {step}
                </p>
                <h3
                  className="text-xl font-bold text-foreground mb-3"
                  style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                >
                  {title}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}