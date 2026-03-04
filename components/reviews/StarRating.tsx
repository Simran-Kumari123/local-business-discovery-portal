'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'

interface StarRatingProps {
    value: number
    onChange: (rating: number) => void
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
}

const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
}

export default function StarRating({ value, onChange, size = 'md', disabled = false }: StarRatingProps) {
    const [hoverValue, setHoverValue] = useState(0)

    const displayValue = hoverValue || value

    return (
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(star)}
                    onMouseEnter={() => !disabled && setHoverValue(star)}
                    onMouseLeave={() => setHoverValue(0)}
                    className={`transition-all duration-150 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'
                        }`}
                    aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                    role="radio"
                    aria-checked={value === star}
                >
                    <Star
                        className={`${sizeMap[size]} transition-colors duration-150 ${star <= displayValue
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-none text-gray-300 dark:text-gray-600'
                            } ${!disabled && hoverValue >= star ? 'drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]' : ''}`}
                    />
                </button>
            ))}
            {displayValue > 0 && (
                <span className="ml-2 text-sm font-semibold text-foreground">
                    {displayValue}/5
                </span>
            )}
        </div>
    )
}
