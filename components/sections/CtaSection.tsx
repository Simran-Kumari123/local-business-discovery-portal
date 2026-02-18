import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-12 md:p-20 text-center text-white">

          {/* Bg blobs */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl" />
          <div className="absolute top-10 right-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl" />

          {/* Dot grid overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-sm font-medium mb-6">
              <MapPin className="w-4 h-4 text-yellow-300" />
              <span>Free to join. No credit card needed.</span>
            </div>

            <h2
              className="font-extrabold text-3xl md:text-5xl mb-5 tracking-tight"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              Ready to Discover<br />
              <span className="text-yellow-300">Local Businesses?</span>
            </h2>

            <p className="text-blue-100 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              Join over 2 million users discovering great local businesses every day.
              Sign up free and start exploring your city.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl text-base shadow-xl shadow-blue-900/30 hover:bg-blue-50 hover:scale-[1.03] transition-all duration-200"
              >
                Get Started — It&apos;s Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/50 hover:border-white text-white font-bold rounded-xl text-base hover:bg-white/10 hover:scale-[1.03] transition-all duration-200"
              >
                Learn More
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
              {['No credit card required', 'Free forever plan', 'Cancel anytime'].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center">
                    <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 3" stroke="white" strokeWidth="1.5" />
                    </svg>
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}