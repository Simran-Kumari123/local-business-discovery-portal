'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

export default function LoginForm() {
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(form.email, form.password)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-input bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent hover:border-ring/50 transition-all duration-200"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">
          Email Address
        </label>
        <input
          name="email" type="email" autoComplete="email" required
          placeholder="john@example.com"
          value={form.email} onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-foreground">Password</label>
          <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
        </div>
        <div className="relative">
          <input
            name="password" type={showPw ? 'text' : 'password'}
            autoComplete="current-password" required
            placeholder="Enter your password"
            value={form.password} onChange={handleChange}
            className={`${inputClass} pr-12`}
          />
          <button
            type="button" onClick={() => setShowPw(!showPw)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Remember me toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div className="relative">
          <input
            type="checkbox" checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-muted rounded-full peer-checked:bg-primary transition-colors duration-200" />
          <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-5" />
        </div>
        <span className="text-sm text-muted-foreground">Remember me for 30 days</span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-md transition-all duration-200 hover:scale-[1.02] mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-primary font-semibold hover:underline">
          Sign up for free
        </Link>
      </p>
    </form>
  )
}