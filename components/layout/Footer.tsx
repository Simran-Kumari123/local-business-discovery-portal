import Link from 'next/link'
import { MapPin, Twitter, Instagram, Facebook, Linkedin, Youtube, Mail, Phone } from 'lucide-react'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
]

const categories = [
  'Restaurants', 'Gyms & Fitness', 'Salons & Beauty',
  'Shopping', 'Education', 'Healthcare',
]

const socials = [
  { Icon: Twitter, label: 'Twitter' },
  { Icon: Instagram, label: 'Instagram' },
  { Icon: Facebook, label: 'Facebook' },
  { Icon: Linkedin, label: 'LinkedIn' },
  { Icon: Youtube, label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bg-card text-muted-foreground border-t border-border">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span
                className="font-bold text-xl text-foreground"
                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
              >
                Local<span className="text-primary">Biz</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Connecting you with the best local businesses in your community. Discover, review, and support local.
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="mailto:hello@localbiz.in" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" /> hello@localbiz.in
              </a>
              <a href="tel:+911234567890" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" /> +91 12345 67890
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-foreground font-bold mb-5"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4
              className="text-foreground font-bold mb-5"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              Categories
            </h4>
            <ul className="flex flex-col gap-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150">
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Socials */}
          <div>
            <h4
              className="text-foreground font-bold mb-5"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              Stay Updated
            </h4>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Get the latest local business highlights delivered to your inbox.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm shadow-md transition-all duration-200 hover:scale-[1.02]">
                Subscribe
              </button>
            </div>

            {/* Socials */}
            <div className="flex gap-3 mt-6">
              {socials.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-background border border-border hover:bg-primary flex items-center justify-center text-muted-foreground hover:text-primary-foreground transition-all duration-200 hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} LocalBiz. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a key={item} href="#" className="hover:text-foreground transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}