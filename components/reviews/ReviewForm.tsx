'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import StarRating from './StarRating'
import Link from 'next/link'
import { Send, Loader2, LogIn } from 'lucide-react'

interface ReviewFormProps {
    businessId: string
    onReviewSubmitted: () => void
    existingReview?: {
        _id: string
        rating: number
        comment: string
    } | null
}

export default function ReviewForm({ businessId, onReviewSubmitted, existingReview }: ReviewFormProps) {
    const { user } = useAuth()
    const [rating, setRating] = useState(existingReview?.rating || 0)
    const [comment, setComment] = useState(existingReview?.comment || '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const isEditing = !!existingReview

    // Not logged in — show login prompt
    if (!user) {
        return (
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
                <h3
                    className="text-lg font-bold text-foreground mb-3"
                    style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                >
                    ✍️ Write a Review
                </h3>
                <div className="text-center py-6">
                    <div className="w-14 h-14 mx-auto bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
                        <LogIn className="w-7 h-7 text-blue-400" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                        Please log in to write a review and rate this business.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-200 hover:scale-[1.03] shadow-md"
                    >
                        <LogIn className="w-4 h-4" /> Log In to Review
                    </Link>
                </div>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (rating === 0) {
            setError('Please select a star rating')
            return
        }
        if (comment.trim().length < 3) {
            setError('Comment must be at least 3 characters')
            return
        }

        setLoading(true)
        try {
            const url = isEditing ? `/api/reviews/${existingReview._id}` : '/api/reviews'
            const method = isEditing ? 'PUT' : 'POST'
            const body = isEditing
                ? { rating, comment: comment.trim() }
                : { businessId, rating, comment: comment.trim() }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Something went wrong')
                return
            }

            setSuccess(isEditing ? 'Review updated successfully!' : 'Review submitted successfully!')
            if (!isEditing) {
                setRating(0)
                setComment('')
            }
            onReviewSubmitted()
        } catch {
            setError('Failed to submit review. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
            <h3
                className="text-lg font-bold text-foreground mb-4"
                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
                {isEditing ? '✏️ Edit Your Review' : '✍️ Write a Review'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating */}
                <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                        Your Rating
                    </label>
                    <StarRating value={rating} onChange={setRating} size="lg" disabled={loading} />
                </div>

                {/* Comment */}
                <div>
                    <label htmlFor="review-comment" className="block text-sm font-semibold text-foreground mb-2">
                        Your Review
                    </label>
                    <textarea
                        id="review-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this business..."
                        rows={4}
                        maxLength={1000}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 text-sm resize-none disabled:opacity-50"
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                        {comment.length}/1000
                    </p>
                </div>

                {/* Error / Success messages */}
                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                        {success}
                    </div>
                )}

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all duration-200 hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {isEditing ? 'Updating...' : 'Submitting...'}
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            {isEditing ? 'Update Review' : 'Submit Review'}
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
