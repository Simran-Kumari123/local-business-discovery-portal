'use client'

import { Star, Trash2, Pencil, Loader2, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'

interface Review {
    _id: string
    user: {
        _id: string
        name: string
        email: string
    }
    rating: number
    comment: string
    createdAt: string
    updatedAt: string
}

interface ReviewCardProps {
    review: Review
    onDelete: (reviewId: string) => void
    onEdit: (review: Review) => void
}

export default function ReviewCard({ review, onDelete, onEdit }: ReviewCardProps) {
    const { user } = useAuth()
    const [deleting, setDeleting] = useState(false)

    const isOwner = user?.id === review.user._id
    const isEdited = review.createdAt !== review.updatedAt

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete your review?')) return
        setDeleting(true)
        try {
            const res = await fetch(`/api/reviews/${review._id}`, { method: 'DELETE' })
            if (res.ok) {
                onDelete(review._id)
            }
        } catch {
            console.error('Failed to delete review')
        } finally {
            setDeleting(false)
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    // Get initials for avatar
    const initials = review.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className="group bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md">
                    {initials || <UserIcon className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h4 className="font-semibold text-foreground text-sm">
                                {review.user.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-3.5 h-3.5 ${star <= review.rating
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'fill-none text-gray-300 dark:text-gray-600'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {formatDate(review.createdAt)}
                                    {isEdited && ' (edited)'}
                                </span>
                            </div>
                        </div>

                        {/* Actions — only show for owner */}
                        {isOwner && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                    onClick={() => onEdit(review)}
                                    className="p-1.5 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                                    title="Edit review"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all disabled:opacity-50"
                                    title="Delete review"
                                >
                                    {deleting ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-3.5 h-3.5" />
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed whitespace-pre-line">
                        {review.comment}
                    </p>
                </div>
            </div>
        </div>
    )
}
