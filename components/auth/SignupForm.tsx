'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

export default function SignupForm() {
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const result = await signup(form.name, form.email, form.password)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/dashboard/register-business')
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

      {/* Full Name */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Full Name</label>
        <input
          name="name" type="text" autoComplete="name" required
          placeholder="John Doe"
          value={form.name} onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Email Address</label>
        <input
          name="email" type="email" autoComplete="email" required
          placeholder="john@example.com"
          value={form.email} onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Password</label>
        <div className="relative">
          <input
            name="password" type={showPw ? 'text' : 'password'}
            autoComplete="new-password" required
            placeholder="At least 6 characters"
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

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Confirm Password</label>
        <input
          name="confirmPassword" type="password"
          autoComplete="new-password" required
          placeholder="Confirm your password"
          value={form.confirmPassword} onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-md transition-all duration-200 hover:scale-[1.02] mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
        {loading ? 'Creating account…' : 'Create Account'}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}