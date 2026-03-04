import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Review from '@/models/Review'
import Business from '@/models/Business'
import User from '@/models/User'
import { getCurrentUser } from '@/lib/auth'
import { recalculateBusinessRating, getRatingBreakdown } from '@/lib/ratings'

// GET /api/reviews?businessId=...&page=1&limit=10
export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        // ensure User model is registered for populate
        void User

        const { searchParams } = new URL(req.url)
        const businessId = searchParams.get('businessId')
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
        const skip = (page - 1) * limit

        if (!businessId) {
            return NextResponse.json({ error: 'businessId is required' }, { status: 400 })
        }

        const [reviews, total, breakdown] = await Promise.all([
            Review.find({ business: businessId })
                .populate('user', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Review.countDocuments({ business: businessId }),
            getRatingBreakdown(businessId),
        ])

        // Get the business rating info
        const business = await Business.findById(businessId)
            .select('averageRating totalReviews')
            .lean()

        return NextResponse.json({
            reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            ratingInfo: {
                averageRating: (business as { averageRating?: number })?.averageRating || 0,
                totalReviews: (business as { totalReviews?: number })?.totalReviews || 0,
                breakdown,
            },
        })
    } catch (err: unknown) {
        console.error('Fetch reviews error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/reviews — submit a new review
export async function POST(req: NextRequest) {
    try {
        const payload = await getCurrentUser()
        if (!payload) {
            return NextResponse.json({ error: 'You must be logged in to submit a review' }, { status: 401 })
        }

        await dbConnect()
        const { businessId, rating, comment } = await req.json()

        // Validate
        if (!businessId) {
            return NextResponse.json({ error: 'businessId is required' }, { status: 400 })
        }
        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
        }
        if (!comment || comment.trim().length < 3) {
            return NextResponse.json({ error: 'Comment must be at least 3 characters' }, { status: 400 })
        }

        // Check if business exists
        const business = await Business.findById(businessId)
        if (!business) {
            return NextResponse.json({ error: 'Business not found' }, { status: 404 })
        }

        // Prevent reviewing own business
        if (business.owner.toString() === payload.userId) {
            return NextResponse.json({ error: 'You cannot review your own business' }, { status: 403 })
        }

        // Check for duplicate review
        const existingReview = await Review.findOne({ user: payload.userId, business: businessId })
        if (existingReview) {
            return NextResponse.json(
                { error: 'You have already reviewed this business. You can edit your existing review instead.' },
                { status: 409 }
            )
        }

        // Create review
        const review = await Review.create({
            user: payload.userId,
            business: businessId,
            rating: Math.round(rating),
            comment: comment.trim(),
        })

        // Recalculate business rating
        await recalculateBusinessRating(businessId)

        // Populate user info before sending response
        await review.populate('user', 'name email')

        return NextResponse.json(
            { message: 'Review submitted successfully', review },
            { status: 201 }
        )
    } catch (err: unknown) {
        console.error('Create review error:', err)
        // Handle duplicate key error
        if (err instanceof Error && 'code' in err && (err as { code: number }).code === 11000) {
            return NextResponse.json(
                { error: 'You have already reviewed this business' },
                { status: 409 }
            )
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
