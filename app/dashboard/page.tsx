'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Building2, Loader2, MapPin, Phone } from 'lucide-react'

interface Business {
    _id: string
    businessName: string
    category: string
    description: string
    city: string
    area: string
    phone: string
    images: string[]
    updatedAt: string
}

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [businesses, setBusinesses] = useState<Business[]>([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [authLoading, user, router])

    useEffect(() => {
        if (user) {
            fetchBusinesses()
        }
    }, [user])

    const fetchBusinesses = async () => {
        try {
            const res = await fetch('/api/business')
            const data = await res.json()
            setBusinesses(data.businesses || [])
        } catch {
            console.error('Failed to fetch businesses')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this business?')) return
        setDeleting(id)
        try {
            const res = await fetch(`/api/business/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setBusinesses((prev) => prev.filter((b) => b._id !== id))
            }
        } catch {
            console.error('Failed to delete business')
        } finally {
            setDeleting(null)
        }
    }

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-secondary/30">
            {/* Header */}
            <section className="relative py-16 overflow-hidden bg-linear-to-br from-blue-700 via-blue-600 to-sky-500">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="text-white">
                            <h1
                                className="font-extrabold text-3xl md:text-4xl tracking-tight mb-2"
                                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                            >
                                Welcome back, {user.name.split(' ')[0]}!
                            </h1>
                            <p className="text-blue-100 text-lg">Manage your business listings from here.</p>
                        </div>
                        <Link
                            href="/dashboard/register-business"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-200"
                        >
                            <Plus className="w-5 h-5" /> Register New Business
                        </Link>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 50V25C360 0 720 30 1080 15C1260 7 1380 5 1440 0V50H0Z" className="fill-secondary/30" />
                    </svg>
                </div>
            </section>

            {/* Business list */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : businesses.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto bg-blue-50 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center mb-6">
                            <Building2 className="w-10 h-10 text-blue-400" />
                        </div>
                        <h2
                            className="text-2xl font-bold text-foreground mb-3"
                            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                        >
                            No businesses yet
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                            You haven&apos;t registered any business yet. Start by adding your first business listing.
                        </p>
                        <Link
                            href="/dashboard/register-business"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all duration-200 hover:scale-[1.03]"
                        >
                            <Plus className="w-5 h-5" /> Register Your Business
                        </Link>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {businesses.map((biz) => (
                            <div
                                key={biz._id}
                                className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-100/60 dark:hover:shadow-blue-900/30 overflow-hidden group transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="w-full h-44 bg-secondary/50 relative overflow-hidden">
                                    {biz.images && biz.images.length > 0 ? (
                                        <img
                                            src={biz.images[0]}
                                            alt={biz.businessName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Building2 className="w-12 h-12 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    <span className="absolute top-3 left-3 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-bold rounded-full">
                                        {biz.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3
                                        className="font-bold text-lg text-foreground mb-2 line-clamp-1"
                                        style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                                    >
                                        {biz.businessName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{biz.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" /> {biz.area}, {biz.city}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-3.5 h-3.5" /> {biz.phone}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/dashboard/edit-business/${biz._id}`}
                                            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                                        >
                                            <Pencil className="w-3.5 h-3.5" /> Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(biz._id)}
                                            disabled={deleting === biz._id}
                                            className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-50"
                                        >
                                            {deleting === biz._id ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
