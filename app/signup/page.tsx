import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, CheckCircle } from 'lucide-react'
import SignupForm from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Sign Up – LocalBiz',
  description: 'Create your free LocalBiz account.',
}

const perks = [
  'Free to join — always',
  'Save your favourite businesses',
  'Write verified reviews',
  'List and manage your business',
]

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center py-16 px-4">

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sky-200/40 dark:bg-sky-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl">

        {/* Split card */}
        <div className="grid lg:grid-cols-5 overflow-hidden rounded-3xl shadow-2xl shadow-blue-100/50 dark:shadow-gray-950 border border-border">

          {/* Left panel */}
          <div className="hidden lg:flex lg:col-span-2 flex-col justify-between bg-linear-to-br from-blue-700 via-blue-600 to-sky-500 p-10 text-white relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl" />

            <div className="relative">
              <Link href="/" className="inline-flex items-center gap-2 mb-10">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <span
                  className="font-bold text-xl"
                  style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                >
                  LocalBiz
                </span>
              </Link>

              <h2
                className="font-extrabold text-3xl leading-tight mb-4"
                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
              >
                Join 2 Million+ Users Discovering Local
              </h2>
              <p className="text-blue-100 text-base leading-relaxed mb-8">
                Create a free account and start exploring, reviewing, and supporting the best businesses in your area.
              </p>

              <ul className="flex flex-col gap-3">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle className="w-5 h-5 text-yellow-300 shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            {/* Testimonial quote */}
            <div className="relative bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-5 mt-8">
              <p className="text-sm text-blue-100 leading-relaxed italic mb-3">
                &quot;LocalBiz helped me grow my salon&apos;s customer base by 3x in just six months!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-xs">
                  SR
                </div>
                <div>
                  <p className="text-xs font-semibold">Sneha Rajan</p>
                  <p className="text-xs text-blue-200">Business Owner · Chennai</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div className="lg:col-span-3 bg-card p-8 md:p-10">

            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-sky-500 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <span
                  className="font-bold text-xl text-foreground"
                  style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                >
                  Local<span className="text-primary">Biz</span>
                </span>
              </Link>
            </div>

            <div className="mb-8">
              <h1
                className="text-2xl font-bold text-foreground mb-1"
                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
              >
                Create your account
              </h1>
              <p className="text-muted-foreground text-sm">
                It&apos;s free and takes less than 2 minutes.
              </p>
            </div>

            <SignupForm />
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing up, you agree to our{' '}
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          {' '}and{' '}
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}