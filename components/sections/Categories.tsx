import {
  UtensilsCrossed, Dumbbell, Scissors, ShoppingBag,
  GraduationCap, HeartPulse, Car, Coffee, ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

const categories = [
  { Icon: UtensilsCrossed, label: 'Restaurant', iconColor: 'text-orange-600 dark:text-orange-400', iconBg: 'bg-orange-50 dark:bg-orange-900/20' },
  { Icon: Dumbbell, label: 'Gyms', iconColor: 'text-red-600 dark:text-red-400', iconBg: 'bg-red-50 dark:bg-red-900/20' },
  { Icon: Scissors, label: 'Salons', iconColor: 'text-pink-600 dark:text-pink-400', iconBg: 'bg-pink-50 dark:bg-pink-900/20' },
  { Icon: ShoppingBag, label: 'Shopping', iconColor: 'text-violet-600 dark:text-violet-400', iconBg: 'bg-violet-50 dark:bg-violet-900/20' },
  { Icon: GraduationCap, label: 'Education', iconColor: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-50 dark:bg-blue-900/30' },
  { Icon: HeartPulse, label: 'Healthcare', iconColor: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { Icon: Car, label: 'Auto Services', iconColor: 'text-sky-600 dark:text-sky-400', iconBg: 'bg-sky-50 dark:bg-sky-900/20' },
  { Icon: Coffee, label: 'Cafés', iconColor: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-50 dark:bg-amber-900/20' },
]

export default function Categories() {
  return (
    <section id="categories" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4 border border-border">
              Browse Categories
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              Find by Category
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg">
              Explore local businesses organised into easy-to-browse categories.
            </p>
          </div>
          <Link
            href="/businesses"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 font-medium rounded-xl transition-all duration-200 shrink-0 group"
          >
            View all categories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map(({ Icon, label, iconColor, iconBg }) => (
            <Link
              key={label}
              href={`/businesses?category=${encodeURIComponent(label)}`}
              className="bg-card border-2 border-transparent hover:border-blue-100 dark:hover:border-blue-800 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-100/60 dark:hover:shadow-blue-900/30 p-6 flex flex-col items-center text-center gap-4 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center`}>
                <Icon className="w-7 h-7" strokeWidth={1.75} />
              </div>
              <div>
                <p
                  className="font-bold text-foreground text-base"
                  style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                >
                  {label}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}