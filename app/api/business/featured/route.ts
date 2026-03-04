import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Business from '@/models/Business'

// GET /api/business/featured — returns the 6 most recently registered businesses
export async function GET() {
    try {
        await dbConnect()

        const businesses = await Business.find({})
            .sort({ createdAt: -1 })
            .limit(6)
            .select('businessName category description averageRating totalReviews images city area openingHours')
            .lean()

        return NextResponse.json({ businesses })
    } catch (err: unknown) {
        console.error('Featured businesses error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
