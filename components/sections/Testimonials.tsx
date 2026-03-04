import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Food Enthusiast',
    location: 'Mumbai',
    initials: 'PS',
    avatarBg: 'bg-gradient-to-br from-pink-500 to-rose-500',
    rating: 5,
    text: "LocalBiz helped me discover this amazing little cafe I never would have found on my own. The reviews were spot-on — great coffee, cozy vibes, and super friendly staff!",
  },
  {
    name: 'Rahul Mehta',
    role: 'Gym Owner',
    location: 'Bangalore',
    initials: 'RM',
    avatarBg: 'bg-gradient-to-br from-blue-500 to-indigo-500',
    rating: 5,
    text: "As a business owner, the dashboard is a game-changer. I can respond to reviews, update our schedule, and reach new customers all in one place. Our bookings went up 40%!",
  },
  {
    name: 'Ananya Patel',
    role: 'Healthcare Seeker',
    location: 'Ahmedabad',
    initials: 'AP',
    avatarBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    rating: 5,
    text: "Finding a reliable dermatologist nearby used to be stressful. With LocalBiz, I found three highly-rated options, read real patient reviews, and booked an appointment the same day.",
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4 border border-border">
            Testimonials
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
          >
            Loved by Our Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from real users across India who discovered something great near them.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map(({ name, role, location, initials, avatarBg, rating, text }) => (
            <div
              key={name}
              className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-100/60 dark:hover:shadow-blue-900/30 p-8 flex flex-col gap-5 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Quote className="w-5 h-5 text-primary" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="text-muted-foreground leading-relaxed text-[15px] flex-1">
                &ldquo;{text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className={`w-11 h-11 rounded-full ${avatarBg} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {initials}
                </div>
                <div>
                  <p
                    className="font-bold text-foreground text-sm"
                    style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                  >
                    {name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {role} · {location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}