'use client'

import Link from 'next/link'
import {
    ArrowLeft,
    MapPin,
    Phone,
    Mail,
    Globe,
    Clock,
    Building2,
    Share2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    MessageSquare,
    Star,
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import StarDisplay from '@/components/reviews/StarDisplay'
import RatingBreakdown from '@/components/reviews/RatingBreakdown'
import ReviewForm from '@/components/reviews/ReviewForm'
import ReviewCard from '@/components/reviews/ReviewCard'

interface Business {
    _id: string
    businessName: string
    category: string
    description: string
    phone: string
    email: string
    website?: string
    address: string
    city: string
    state: string
    pincode: string
    area: string
    openingHours: string
    images: string[]
    averageRating: number
    totalReviews: number
    createdAt: string
    updatedAt: string
}

interface ReviewUser {
    _id: string
    name: string
    email: string
}

interface Review {
    _id: string
    user: ReviewUser
    rating: number
    comment: string
    createdAt: string
    updatedAt: string
}

interface RatingInfo {
    averageRating: number
    totalReviews: number
    breakdown: Record<number, number>
}

export default function BusinessDetailClient({ business }: { business: Business }) {
    const { user } = useAuth()
    const [currentImage, setCurrentImage] = useState(0)
    const hasImages = business.images && business.images.length > 0

    // Reviews state
    const [reviews, setReviews] = useState<Review[]>([])
    const [ratingInfo, setRatingInfo] = useState<RatingInfo>({
        averageRating: business.averageRating || 0,
        totalReviews: business.totalReviews || 0,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    })
    const [reviewsLoading, setReviewsLoading] = useState(true)
    const [reviewPage, setReviewPage] = useState(1)
    const [totalReviewPages, setTotalReviewPages] = useState(1)
    const [editingReview, setEditingReview] = useState<Review | null>(null)

    // Check if current user already has a review
    const userReview = user ? reviews.find((r) => r.user._id === user.id) : null

    const fetchReviews = useCallback(async () => {
        setReviewsLoading(true)
        try {
            const res = await fetch(`/api/reviews?businessId=${business._id}&page=${reviewPage}&limit=10`)
            const data = await res.json()
            setReviews(data.reviews || [])
            if (data.ratingInfo) {
                setRatingInfo(data.ratingInfo)
            }
            setTotalReviewPages(data.pagination?.totalPages || 1)
        } catch {
            console.error('Failed to fetch reviews')
        } finally {
            setReviewsLoading(false)
        }
    }, [business._id, reviewPage])

    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

    const handleReviewSubmitted = () => {
        fetchReviews()
        setEditingReview(null)
    }

    const handleReviewDeleted = () => {
        fetchReviews()
    }

    const handleEditReview = (review: Review) => {
        setEditingReview(review)
        // Scroll to form
        document.getElementById('review-form-section')?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleCancelEdit = () => {
        setEditingReview(null)
    }

    const handleShare = async () => {
        const url = window.location.href
        if (navigator.share) {
            await navigator.share({
                title: business.businessName,
                text: business.description,
                url,
            })
        } else {
            await navigator.clipboard.writeText(url)
            alert('Link copied to clipboard!')
        }
    }

    return (
        <div className="min-h-screen bg-secondary/30">
            {/* Header */}
            <section className="relative overflow-hidden bg-linear-to-br from-blue-700 via-blue-600 to-sky-500 dark:from-blue-950 dark:via-blue-900 dark:to-sky-900">
                <div
                    className="absolute inset-0 opacity-[0.12] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }}
                />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                    <Link
                        href="/businesses"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-100 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Listings
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div className="text-white">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-xs font-semibold mb-3">
                                <Building2 className="w-3 h-3" />
                                {business.category}
                            </span>
                            <h1
                                className="font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-2"
                                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                            >
                                {business.businessName}
                            </h1>
                            <div className="flex items-center gap-3 text-blue-100 mb-2">
                                <MapPin className="w-4 h-4" />
                                <span>{business.area}, {business.city}, {business.state} – {business.pincode}</span>
                            </div>
                            {/* Rating in header */}
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-5 h-5 ${star <= Math.round(ratingInfo.averageRating)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'fill-none text-white/40'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-white font-bold text-lg">
                                    {ratingInfo.averageRating > 0 ? ratingInfo.averageRating.toFixed(1) : '—'}
                                </span>
                                <span className="text-blue-200 text-sm">
                                    ({ratingInfo.totalReviews} {ratingInfo.totalReviews === 1 ? 'review' : 'reviews'})
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleShare}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/25 text-white text-sm font-semibold rounded-xl transition-all duration-200 self-start md:self-auto"
                        >
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full">
                        <path d="M0 50V25C360 0 720 30 1080 15C1260 7 1380 5 1440 0V50H0Z" className="fill-secondary/30" />
                    </svg>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left — Image + Description + Reviews */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        {hasImages && (
                            <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
                                <img
                                    src={business.images[currentImage]}
                                    alt={`${business.businessName} - Image ${currentImage + 1}`}
                                    className="w-full h-64 md:h-96 object-cover"
                                />
                                {business.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setCurrentImage((p) => (p === 0 ? business.images.length - 1 : p - 1))}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setCurrentImage((p) => (p === business.images.length - 1 ? 0 : p + 1))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                                            {business.images.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentImage(i)}
                                                    className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                                {/* Thumbnails */}
                                {business.images.length > 1 && (
                                    <div className="flex gap-2 p-3 overflow-x-auto">
                                        {business.images.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentImage(i)}
                                                className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${i === currentImage ? 'border-primary ring-2 ring-primary/30' : 'border-transparent opacity-60 hover:opacity-100'
                                                    }`}
                                            >
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* No image placeholder */}
                        {!hasImages && (
                            <div className="bg-card border border-border rounded-2xl shadow-sm h-56 flex items-center justify-center">
                                <div className="text-center">
                                    <Building2 className="w-14 h-14 text-blue-200 dark:text-blue-800 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">No images uploaded yet</p>
                                </div>
                            </div>
                        )}

                        {/* About */}
                        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8">
                            <h2
                                className="text-xl font-bold text-foreground mb-4"
                                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                            >
                                About the Business
                            </h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {business.description}
                            </p>
                        </div>

                        {/* ═══════════════════════════════════════
                            RATING BREAKDOWN
                        ═══════════════════════════════════════ */}
                        <RatingBreakdown
                            breakdown={ratingInfo.breakdown}
                            totalReviews={ratingInfo.totalReviews}
                            averageRating={ratingInfo.averageRating}
                        />

                        {/* ═══════════════════════════════════════
                            REVIEW FORM
                        ═══════════════════════════════════════ */}
                        <div id="review-form-section">
                            {/* If user already reviewed AND is not editing, show a message */}
                            {userReview && !editingReview ? (
                                <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
                                    <h3
                                        className="text-lg font-bold text-foreground mb-3"
                                        style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                                    >
                                        ✅ You&apos;ve Already Reviewed
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        You&apos;ve already submitted a review for this business. You can edit or delete it from the reviews section below.
                                    </p>
                                    <button
                                        onClick={() => handleEditReview(userReview)}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-200 hover:scale-[1.03] shadow-md text-sm"
                                    >
                                        ✏️ Edit Your Review
                                    </button>
                                </div>
                            ) : (
                                <ReviewForm
                                    businessId={business._id}
                                    onReviewSubmitted={handleReviewSubmitted}
                                    existingReview={editingReview ? {
                                        _id: editingReview._id,
                                        rating: editingReview.rating,
                                        comment: editingReview.comment,
                                    } : null}
                                />
                            )}
                            {editingReview && (
                                <button
                                    onClick={handleCancelEdit}
                                    className="mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                                >
                                    ← Cancel editing
                                </button>
                            )}
                        </div>

                        {/* ═══════════════════════════════════════
                            REVIEWS LIST
                        ═══════════════════════════════════════ */}
                        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
                            <h3
                                className="text-lg font-bold text-foreground mb-5 flex items-center gap-2"
                                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                            >
                                <MessageSquare className="w-5 h-5 text-primary" />
                                Customer Reviews
                                {ratingInfo.totalReviews > 0 && (
                                    <span className="text-sm font-medium text-muted-foreground">
                                        ({ratingInfo.totalReviews})
                                    </span>
                                )}
                            </h3>

                            {reviewsLoading ? (
                                <div className="flex items-center justify-center py-10">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            ) : reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <ReviewCard
                                            key={review._id}
                                            review={review}
                                            onDelete={handleReviewDeleted}
                                            onEdit={handleEditReview}
                                        />
                                    ))}

                                    {/* Review pagination */}
                                    {totalReviewPages > 1 && (
                                        <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-border">
                                            <button
                                                onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                                                disabled={reviewPage === 1}
                                                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                ← Prev
                                            </button>
                                            <span className="text-xs text-muted-foreground font-medium">
                                                Page {reviewPage} of {totalReviewPages}
                                            </span>
                                            <button
                                                onClick={() => setReviewPage((p) => Math.min(totalReviewPages, p + 1))}
                                                disabled={reviewPage === totalReviewPages}
                                                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                Next →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-muted-foreground text-sm">
                                        No reviews yet. Be the first to review this business!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right — Contact + Location card */}
                    <div className="space-y-6">
                        {/* Rating Summary Card */}
                        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
                            <h3
                                className="text-lg font-bold text-foreground mb-4"
                                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                            >
                                ⭐ Overall Rating
                            </h3>
                            <div className="text-center">
                                <div
                                    className="text-4xl font-extrabold text-foreground mb-1"
                                    style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                                >
                                    {ratingInfo.averageRating > 0 ? ratingInfo.averageRating.toFixed(1) : '—'}
                                </div>
                                <StarDisplay
                                    rating={ratingInfo.averageRating}
                                    totalReviews={ratingInfo.totalReviews}
                                    size="md"
                                    showNumber={false}
                                    className="justify-center"
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    Based on {ratingInfo.totalReviews} {ratingInfo.totalReviews === 1 ? 'review' : 'reviews'}
                                </p>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
                            <h3
                                className="text-lg font-bold text-foreground mb-5"
                                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                            >
                                📞 Contact Information
                            </h3>
                            <div className="space-y-4">
                                <a href={`tel:${business.phone}`} className="flex items-start gap-3 group">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                        <Phone className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium">Phone</p>
                                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{business.phone}</p>
                                    </div>
                                </a>

                                <a href={`mailto:${business.email}`} className="flex items-start gap-3 group">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium">Email</p>
                                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors break-all">{business.email}</p>
                                    </div>
                                </a>

                                {business.website && (
                                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                                            <Globe className="w-4 h-4 text-purple-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium">Website</p>
                                            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors break-all">{business.website}</p>
                                        </div>
                                    </a>
                                )}

                                {business.openingHours && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                                            <Clock className="w-4 h-4 text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium">Opening Hours</p>
                                            <p className="text-sm font-semibold text-foreground">{business.openingHours}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
                            <h3
                                className="text-lg font-bold text-foreground mb-5"
                                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                            >
                                📍 Location
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{business.address}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {business.area}, {business.city}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {business.state} – {business.pincode}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Map placeholder */}
                            <div className="mt-4 w-full h-40 rounded-xl bg-secondary/50 border border-border flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin className="w-8 h-8 text-muted-foreground/30 mx-auto mb-1" />
                                    <p className="text-xs text-muted-foreground/60">Map view coming soon</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="bg-linear-to-br from-blue-600 to-sky-500 rounded-2xl p-6 text-white shadow-lg">
                            <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
                                Interested in this business?
                            </h3>
                            <p className="text-blue-100 text-sm mb-4">
                                Get in touch directly via phone or email for enquiries.
                            </p>
                            <a
                                href={`tel:${business.phone}`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200 text-sm"
                            >
                                <Phone className="w-4 h-4" /> Call Now
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
