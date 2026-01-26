'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
    rating: number
    interactive?: boolean
    onRatingChange?: (rating: number) => void
    size?: 'sm' | 'md' | 'lg'
}

export function StarRating({ rating, interactive = false, onRatingChange, size = 'md' }: StarRatingProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    }

    const stars = Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1
        const isActive = starValue <= Math.floor(rating)
        const isHalf = starValue === Math.ceil(rating) && !Number.isInteger(rating)

        return (
            <div
                key={i}
                className="relative"
                onClick={() => interactive && onRatingChange?.(starValue)}
            >
                {/* Background star */}
                <Star
                    className={cn(
                        sizeClasses[size],
                        'transition-colors',
                        interactive ? 'cursor-pointer hover:text-yellow-400' : '',
                        isActive || isHalf ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
                    )}
                />
                {/* Half fill star */}
                {isHalf && (
                    <div className="absolute inset-0 overflow-hidden w-1/2">
                        <Star className={cn(sizeClasses[size], 'text-yellow-400 fill-yellow-400')} />
                    </div>
                )}
            </div>
        )
    })

    return <div className="flex gap-1">{stars}</div>
}

interface RatingDisplayProps {
    rating: number
    count: number
}

export function RatingDisplay({ rating, count }: RatingDisplayProps) {
    return (
        <div className="flex items-center gap-2">
            <StarRating rating={rating} size="md" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({count} {count === 1 ? 'review' : 'reviews'})</span>
        </div>
    )
}
