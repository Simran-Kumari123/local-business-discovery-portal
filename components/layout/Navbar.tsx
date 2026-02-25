'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, MapPin, Sun, Moon, LogOut, LayoutDashboard } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAuth } from '@/components/providers/AuthProvider'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/businesses', label: 'Businesses' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? 'bg-background/90 backdrop-blur-md shadow-md border-b border-border'
        : 'bg-transparent'
        }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-200/50 dark:shadow-blue-900/20 group-hover:scale-110 transition-transform duration-200">
              <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span
              className="text-xl font-bold text-foreground tracking-tight"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              Local<span className="text-primary">Biz</span>
            </span>
          </Link>

          {/* ── Desktop links ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 group overflow-hidden ${active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                    }`}
                >
                  <span className="absolute inset-0 bg-primary/10 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                  <span className="relative">{link.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* ── Desktop right actions ── */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-[1.03]"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-md transition-all duration-200 hover:scale-[1.03]"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2 text-sm font-semibold rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-[1.03]"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-200 hover:scale-[1.03]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile: theme + hamburger ── */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-muted-foreground hover:bg-accent transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-xl text-muted-foreground hover:bg-accent transition-colors"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="flex flex-col gap-1 pt-2 border-t border-border">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 ${active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                >
                  {link.label}
                </Link>
              )
            })}

            {user ? (
              <div className="flex flex-col gap-2 pt-3 border-t border-border">
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false) }}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-md transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3 pt-3 border-t border-border">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-semibold rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}