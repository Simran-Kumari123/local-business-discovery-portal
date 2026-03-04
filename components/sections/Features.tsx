import { Search, Star, LayoutDashboard } from 'lucide-react'

const features = [
  {
    Icon: Search,
    title: 'Search & Discover',
    description:
      'Powerful search with smart filters to find exactly what you need — by category, rating, location, or hours of operation.',
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-900/30',
    accentFrom: 'from-blue-500',
    accentTo: 'to-sky-500',
  },
  {
    Icon: Star,
    title: 'Trusted Reviews',
    description:
      'Real reviews from real customers in your community. Every review is verified to give you authentic, reliable feedback.',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    iconBg: 'bg-yellow-50 dark:bg-yellow-900/20',
    accentFrom: 'from-yellow-400',
    accentTo: 'to-orange-500',
  },
  {
    Icon: LayoutDashboard,
    title: 'Business Dashboard',
    description:
      'Own a business? Claim your listing and manage reviews, update hours, showcase photos, and connect with customers easily.',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    accentFrom: 'from-emerald-500',
    accentTo: 'to-teal-500',
  },
]

export default function Features() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4 border border-border">
            Why LocalBiz?
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
          >
            Everything You Need in One Place
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            LocalBiz connects you with the best local businesses with powerful features built for both customers and business owners.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map(({ Icon, title, description, iconColor, iconBg, accentFrom, accentTo }) => (
            <div
              key={title}
              className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-100/60 dark:hover:shadow-blue-900/30 p-8 group cursor-pointer transition-all duration-300"
            >
              <div className={`w-14 h-14 ${iconBg} ${iconColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-7 h-7" strokeWidth={1.75} />
              </div>
              <h3
                className="text-xl font-bold text-foreground mb-3"
                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
              >
                {title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
              <div className={`mt-6 h-0.5 w-0 group-hover:w-full bg-linear-to-r ${accentFrom} ${accentTo} rounded-full transition-all duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}