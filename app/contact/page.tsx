import type { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'
import ContactForm from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'Contact – LocalBiz',
  description: "Get in touch with the LocalBiz team. We're here to help.",
}

const contactCards = [
  {
    Icon: Mail,
    title: 'Email Us',
    value: 'hello@localbiz.in',
    subtitle: 'We reply within 24 hours',
    href: 'mailto:hello@localbiz.in',
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-900/30',
  },
  {
    Icon: Phone,
    title: 'Call Us',
    value: '+91 12345 67890',
    subtitle: 'Mon–Fri, 9am–6pm IST',
    href: 'tel:+911234567890',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    Icon: MapPin,
    title: 'Our Office',
    value: 'Ahmedabad, Gujarat',
    subtitle: 'India 380015',
    href: '#',
    iconColor: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    Icon: Clock,
    title: 'Support Hours',
    value: 'Mon – Sat',
    subtitle: '9:00 AM – 6:00 PM IST',
    href: '#',
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-50 dark:bg-orange-900/20',
  },
]

export default function ContactPage() {
  return (
    <div className="bg-background">

      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-linear-to-br from-blue-700 via-blue-600 to-sky-500">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-sm font-medium mb-6">
            <MessageCircle className="w-4 h-4" />
            We&apos;d love to hear from you
          </span>
          <h1
            className="font-extrabold text-4xl md:text-5xl mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
          >
            Get in Touch
          </h1>
          <p className="text-lg text-blue-100">
            Questions, feedback, or want to list your business? Our team is ready to help.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50V25C360 0 720 30 1080 15C1260 7 1380 5 1440 0V50H0Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* Contact info cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
            {contactCards.map(({ Icon, title, value, subtitle, href, iconColor, iconBg }) => (
              <a
                key={title}
                href={href}
                className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-100/60 dark:hover:shadow-blue-900/30 p-6 group hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{title}</p>
                <p
                  className="font-bold text-foreground text-base"
                  style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                >
                  {value}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
              </a>
            ))}
          </div>

          {/* Split layout */}
          <div className="grid lg:grid-cols-5 gap-12 items-start">

            {/* Left info panel */}
            <div className="lg:col-span-2">
              <h2
                className="text-3xl font-bold text-foreground mb-4"
                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
              >
                Send Us a Message
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Fill out the form and our team will get back to you within one business day.
                We read every message and genuinely care about your feedback.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Business Listing Support</p>
                    <p className="text-sm text-muted-foreground">
                      Need help adding or managing your business? We&apos;ll walk you through it step by step.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Partnership Inquiries</p>
                    <p className="text-sm text-muted-foreground">
                      Interested in partnering with LocalBiz? Let&apos;s explore opportunities together.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right form */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-2xl shadow-sm p-8 md:p-10">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}