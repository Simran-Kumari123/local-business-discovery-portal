'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { Building2, Upload, X, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const categories = [
    'Restaurant', 'Salon & Spa', 'Gym & Fitness', 'Healthcare',
    'Education', 'Retail', 'Automotive', 'Real Estate',
    'Technology', 'Legal', 'Financial Services', 'Home Services',
    'Entertainment', 'Food & Bakery', 'Other',
]

const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Chandigarh', 'Puducherry',
]

export default function RegisterBusinessPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [images, setImages] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)

    const [form, setForm] = useState({
        businessName: '',
        category: '',
        description: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        area: '',
        openingHours: '',
    })

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [authLoading, user, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value })

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        setUploading(true)
        try {
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData()
                formData.append('file', files[i])

                const res = await fetch('/api/upload', { method: 'POST', body: formData })
                const data = await res.json()

                if (res.ok) {
                    setImages((prev) => [...prev, data.url])
                } else {
                    setError(data.error || 'Upload failed')
                }
            }
        } catch {
            setError('Failed to upload image')
        } finally {
            setUploading(false)
        }
    }

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/business', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, images }),
            })

            const data = await res.json()
            if (!res.ok) {
                setError(data.error)
                setLoading(false)
                return
            }

            setSuccess(true)
            setTimeout(() => router.push('/dashboard'), 2000)
        } catch {
            setError('Something went wrong')
            setLoading(false)
        }
    }

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-emerald-50 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center mb-6">
                        <Building2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2
                        className="text-3xl font-bold text-foreground mb-3"
                        style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                    >
                        Business Registered! 🎉
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Your business has been successfully listed. Redirecting to dashboard...
                    </p>
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                </div>
            </div>
        )
    }

    const inputClass =
        "w-full px-4 py-3 rounded-xl border border-input bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent hover:border-ring/50 transition-all duration-200"

    const labelClass = "block text-sm font-semibold text-foreground mb-1.5"

    return (
        <div className="min-h-screen bg-secondary/30">
            {/* Header */}
            <section className="relative py-14 overflow-hidden bg-linear-to-br from-blue-700 via-blue-600 to-sky-500">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <div className="w-16 h-16 mx-auto bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1
                        className="font-extrabold text-3xl md:text-4xl tracking-tight mb-3"
                        style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                    >
                        Register Your Business
                    </h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        Fill in the details below to list your business on LocalBiz and reach thousands of local customers.
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 50V25C360 0 720 30 1080 15C1260 7 1380 5 1440 0V50H0Z" className="fill-secondary/30" />
                    </svg>
                </div>
            </section>

            {/* Form */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                <div className="bg-card border border-border rounded-2xl shadow-sm p-8 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Business info */}
                        <div>
                            <h3
                                className="text-lg font-bold text-foreground mb-5 pb-3 border-b border-border"
                                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                            >
                                📋 Business Information
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>Business Name *</label>
                                    <input name="businessName" required value={form.businessName} onChange={handleChange} placeholder="e.g. Sharma Electronics" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Category *</label>
                                    <select name="category" required value={form.category} onChange={handleChange} className={inputClass}>
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-5">
                                <label className={labelClass}>About Your Business *</label>
                                <textarea
                                    name="description" required rows={4} value={form.description} onChange={handleChange}
                                    placeholder="Describe your business, services, specialities..."
                                    className={`${inputClass} resize-none`}
                                />
                            </div>
                        </div>

                        {/* Contact info */}
                        <div>
                            <h3
                                className="text-lg font-bold text-foreground mb-5 pb-3 border-b border-border"
                                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                            >
                                📞 Contact Details
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>Phone Number *</label>
                                    <input name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="+91 99999 99999" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Business Email *</label>
                                    <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="contact@business.com" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Website</label>
                                    <input name="website" type="url" value={form.website} onChange={handleChange} placeholder="https://www.mybusiness.com" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Opening Hours</label>
                                    <input name="openingHours" value={form.openingHours} onChange={handleChange} placeholder="Mon–Sat 9AM–6PM" className={inputClass} />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <h3
                                className="text-lg font-bold text-foreground mb-5 pb-3 border-b border-border"
                                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                            >
                                📍 Location & Area
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Full Address *</label>
                                    <input name="address" required value={form.address} onChange={handleChange} placeholder="Shop No. 12, Market Road" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Area / Locality *</label>
                                    <input name="area" required value={form.area} onChange={handleChange} placeholder="e.g. Navrangpura, Satellite" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>City *</label>
                                    <input name="city" required value={form.city} onChange={handleChange} placeholder="e.g. Ahmedabad" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>State *</label>
                                    <select name="state" required value={form.state} onChange={handleChange} className={inputClass}>
                                        <option value="">Select state</option>
                                        {indianStates.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Pincode *</label>
                                    <input name="pincode" required value={form.pincode} onChange={handleChange} placeholder="e.g. 380015" className={inputClass} />
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div>
                            <h3
                                className="text-lg font-bold text-foreground mb-5 pb-3 border-b border-border"
                                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                            >
                                🖼️ Business Images
                            </h3>

                            {/* Uploaded images preview */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                                    {images.map((url, i) => (
                                        <div key={i} className="relative group rounded-xl overflow-hidden border border-border">
                                            <img src={url} alt={`Business image ${i + 1}`} className="w-full h-28 object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                {uploading ? (
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                        <span className="text-sm text-muted-foreground font-medium">Click to upload images</span>
                                        <span className="text-xs text-muted-foreground/60 mt-1">JPEG, PNG, WebP or GIF • Max 5 MB each</span>
                                    </>
                                )}
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl shadow-md transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Registering…</>
                            ) : (
                                <><Building2 className="w-5 h-5" /> Register Business</>
                            )}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    )
}
