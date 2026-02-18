'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 1200)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-16 text-center animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <div>
          <h3
            className="font-bold text-2xl text-foreground mb-2"
            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
          >
            Message Sent!
          </h3>
          <p className="text-muted-foreground">Thanks for reaching out. We&apos;ll get back to you within 24 hours.</p>
        </div>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
          className="px-6 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-[1.03]"
        >
          Send another message
        </button>
      </div>
    )
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-input bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent hover:border-ring/50 transition-all duration-200"
  const labelClass = "block text-sm font-semibold text-foreground mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
          <input name="name" type="text" required placeholder="John Doe" value={form.name} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
          <input name="email" type="email" required placeholder="john@example.com" value={form.email} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Subject</label>
        <select name="subject" value={form.subject} onChange={handleChange} className={inputClass}>
          <option value="">Select a subject...</option>
          <option value="general">General Enquiry</option>
          <option value="business">List My Business</option>
          <option value="support">Technical Support</option>
          <option value="report">Report a Listing</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Message <span className="text-red-500">*</span></label>
        <textarea
          name="message" required rows={5}
          placeholder="Tell us how we can help you..."
          value={form.message} onChange={handleChange}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-primary-foreground font-semibold rounded-xl shadow-md transition-all duration-200 hover:scale-[1.02]"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </>
        ) : (
          <>Send Message <Send className="w-4 h-4" /></>
        )}
      </button>
    </form>
  )
}