import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Log In – LocalBiz',
  description: 'Sign in to your LocalBiz account.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center py-16 px-4">

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-200/40 dark:bg-sky-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Card */}
        <div className="bg-card border border-border rounded-3xl shadow-2xl shadow-blue-100/50 dark:shadow-gray-950 p-8 md:p-10">

          {/* Logo + heading */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center shadow-md shadow-blue-300/40">
                <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span
                className="font-bold text-2xl text-foreground"
                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
              >
                Local<span className="text-primary">Biz</span>
              </span>
            </Link>
            <h1
              className="text-2xl font-bold text-foreground mb-1"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              Welcome back
            </h1>
            <p className="text-muted-foreground text-sm">Sign in to continue to LocalBiz</p>
          </div>

          <LoginForm />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our{' '}
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          {' '}and{' '}
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}