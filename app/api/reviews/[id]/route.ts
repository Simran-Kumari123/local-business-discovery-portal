import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Review from '@/models/Review'
import User from '@/models/User'
import { getCurrentUser } from '@/lib/auth'
import { recalculateBusinessRating } from '@/lib/ratings'

interface Params {
    params: Promise<{ id: string }>
}

// PUT /api/reviews/[id] — edit own review
export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const payload = await getCurrentUser()
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        await dbConnect()
        void User

        const review = await Review.findById(id)
        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 })
        }

        // Only the review author can edit
        if (review.user.toString() !== payload.userId) {
            return NextResponse.json({ error: 'You can only edit your own reviews' }, { status: 403 })
        }

        const { rating, comment } = await req.json()

        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
            }
            review.rating = Math.round(rating)
        }

        if (comment !== undefined) {
            if (comment.trim().length < 3) {
                return NextResponse.json({ error: 'Comment must be at least 3 characters' }, { status: 400 })
            }
            review.comment = comment.trim()
        }

        await review.save()

        // Recalculate business rating
        await recalculateBusinessRating(review.business.toString())

        await review.populate('user', 'name email')

        return NextResponse.json({ message: 'Review updated successfully', review })
    } catch (err: unknown) {
        console.error('Update review error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE /api/reviews/[id] — delete own review (or admin can delete any)
export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const payload = await getCurrentUser()
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        await dbConnect()

        const review = await Review.findById(id)
        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 })
        }

        // Only the author or an admin can delete
        if (review.user.toString() !== payload.userId && payload.role !== 'admin') {
            return NextResponse.json({ error: 'You can only delete your own reviews' }, { status: 403 })
        }

        const businessId = review.business.toString()
        await Review.findByIdAndDelete(id)

        // Recalculate business rating
        await recalculateBusinessRating(businessId)

        return NextResponse.json({ message: 'Review deleted successfully' })
    } catch (err: unknown) {
        console.error('Delete review error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
