'use client'

interface RatingBreakdownProps {
    breakdown: Record<number, number>
    totalReviews: number
    averageRating: number
}

export default function RatingBreakdown({ breakdown, totalReviews, averageRating }: RatingBreakdownProps) {
    return (
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
            <h3
                className="text-lg font-bold text-foreground mb-5"
                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
                ⭐ Ratings & Reviews
            </h3>

            <div className="flex items-start gap-6">
                {/* Big average rating */}
                <div className="text-center shrink-0">
                    <div
                        className="text-5xl font-extrabold text-foreground"
                        style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                    >
                        {averageRating > 0 ? averageRating.toFixed(1) : '—'}
                    </div>
                    <div className="flex items-center justify-center gap-0.5 mt-1.5 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                className={`w-4 h-4 ${star <= Math.round(averageRating)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-gray-300 dark:text-gray-600 fill-none'
                                    }`}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                        {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                    </p>
                </div>

                {/* Breakdown bars */}
                <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = breakdown[star] || 0
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

                        return (
                            <div key={star} className="flex items-center gap-2.5">
                                <span className="text-xs font-semibold text-muted-foreground w-3 text-right">
                                    {star}
                                </span>
                                <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                                <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500 ease-out bg-amber-400"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground font-medium w-6 text-right">
                                    {count}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
