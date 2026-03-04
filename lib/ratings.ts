import mongoose from 'mongoose'
import dbConnect from './dbConnect'
import Review from '@/models/Review'
import Business from '@/models/Business'

/**
 * Recalculate and update the average rating & total reviews for a business.
 * Uses MongoDB aggregation for efficient computation.
 */
export async function recalculateBusinessRating(businessId: string | mongoose.Types.ObjectId) {
    await dbConnect()

    const result = await Review.aggregate([
        { $match: { business: new mongoose.Types.ObjectId(businessId.toString()) } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 },
            },
        },
    ])

    const stats = result[0] || { averageRating: 0, totalReviews: 0 }

    await Business.findByIdAndUpdate(businessId, {
        averageRating: Math.round(stats.averageRating * 10) / 10, // round to 1 decimal
        totalReviews: stats.totalReviews,
    })

    return stats
}

/**
 * Get the rating breakdown (count per star level) for a business.
 */
export async function getRatingBreakdown(businessId: string | mongoose.Types.ObjectId) {
    await dbConnect()

    const result = await Review.aggregate([
        { $match: { business: new mongoose.Types.ObjectId(businessId.toString()) } },
        {
            $group: {
                _id: '$rating',
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: -1 } },
    ])

    // Build a complete breakdown object (5 → 1)
    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    for (const entry of result) {
        breakdown[entry._id] = entry.count
    }

    return breakdown
}
