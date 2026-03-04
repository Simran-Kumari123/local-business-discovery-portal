'use client'

import { Star } from 'lucide-react'

interface StarDisplayProps {
    rating: number
    totalReviews?: number
    size?: 'xs' | 'sm' | 'md' | 'lg'
    showCount?: boolean
    showNumber?: boolean
    className?: string
}

const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5',
    lg: 'w-6 h-6',
}

const textSizeMap = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
}

export default function StarDisplay({
    rating,
    totalReviews,
    size = 'sm',
    showCount = true,
    showNumber = true,
    className = '',
}: StarDisplayProps) {
    const fullStars = Math.floor(rating)
    const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {/* Stars */}
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => {
                    if (star <= fullStars) {
                        // Full star
                        return (
                            <Star
                                key={star}
                                className={`${sizeMap[size]} fill-amber-400 text-amber-400`}
                            />
                        )
                    }
                    if (star === fullStars + 1 && hasHalf) {
                        // Half star (using clip-path)
                        return (
                            <div key={star} className="relative">
                                <Star className={`${sizeMap[size]} fill-none text-gray-300 dark:text-gray-600`} />
                                <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                                    <Star className={`${sizeMap[size]} fill-amber-400 text-amber-400`} />
                                </div>
                            </div>
                        )
                    }
                    // Empty star
                    return (
                        <Star
                            key={star}
                            className={`${sizeMap[size]} fill-none text-gray-300 dark:text-gray-600`}
                        />
                    )
                })}
            </div>

            {/* Rating number */}
            {showNumber && rating > 0 && (
                <span className={`font-bold text-foreground ${textSizeMap[size]}`}>
                    {rating.toFixed(1)}
                </span>
            )}

            {/* Review count */}
            {showCount && totalReviews !== undefined && (
                <span className={`text-muted-foreground ${textSizeMap[size]}`}>
                    ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                </span>
            )}

            {/* No reviews yet */}
            {showCount && (totalReviews === undefined || totalReviews === 0) && rating === 0 && (
                <span className={`text-muted-foreground ${textSizeMap[size]}`}>
                    No reviews yet
                </span>
            )}
        </div>
    )
}
