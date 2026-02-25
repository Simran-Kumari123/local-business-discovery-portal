import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Business from '@/models/Business'
import { getCurrentUser } from '@/lib/auth'
import User from '@/models/User'

// GET /api/search?q=...&category=...&city=...&area=...&state=...&page=1&limit=12
export async function GET(req: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(req.url)
        const q = searchParams.get('q')?.trim() || ''
        const category = searchParams.get('category')?.trim() || ''
        const city = searchParams.get('city')?.trim() || ''
        const area = searchParams.get('area')?.trim() || ''
        const state = searchParams.get('state')?.trim() || ''
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')))
        const skip = (page - 1) * limit

        // Build the filter query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filter: Record<string, any> = {}

        // Text search — search across businessName, category, description, area, city
        if (q) {
            const regex = new RegExp(q, 'i')
            filter.$or = [
                { businessName: regex },
                { category: regex },
                { description: regex },
                { area: regex },
                { city: regex },
                { address: regex },
            ]
        }

        // Category filter
        if (category) {
            filter.category = new RegExp(category, 'i')
        }

        // Location filters
        if (city) {
            filter.city = new RegExp(city, 'i')
        }
        if (area) {
            filter.area = new RegExp(area, 'i')
        }
        if (state) {
            filter.state = new RegExp(state, 'i')
        }

        // Get total count for pagination
        const total = await Business.countDocuments(filter)

        // Try to get logged-in user info for location-based sorting
        let userCity = ''
        let userArea = ''
        try {
            const payload = await getCurrentUser()
            if (payload) {
                // Find the user's most recent business to infer their location
                const userBusiness = await Business.findOne({ owner: payload.userId })
                    .sort({ updatedAt: -1 })
                    .select('city area')
                    .lean()
                if (userBusiness) {
                    userCity = (userBusiness as { city?: string }).city || ''
                    userArea = (userBusiness as { area?: string }).area || ''
                }
            }
        } catch {
            // Not logged in — no problem, skip location-based sorting
        }

        let businesses

        if (userCity || userArea) {
            // Use aggregation for proximity-based sorting:
            // Priority 1: Same area + same city
            // Priority 2: Same city
            // Priority 3: Everything else
            businesses = await Business.aggregate([
                { $match: filter },
                {
                    $addFields: {
                        locationScore: {
                            $add: [
                                {
                                    $cond: [
                                        {
                                            $regexMatch: {
                                                input: '$area',
                                                regex: userArea,
                                                options: 'i',
                                            },
                                        },
                                        2,
                                        0,
                                    ],
                                },
                                {
                                    $cond: [
                                        {
                                            $regexMatch: {
                                                input: '$city',
                                                regex: userCity,
                                                options: 'i',
                                            },
                                        },
                                        1,
                                        0,
                                    ],
                                },
                            ],
                        },
                    },
                },
                { $sort: { locationScore: -1, updatedAt: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        locationScore: 0,
                    },
                },
            ])
        } else {
            // No user location — standard sort by updatedAt
            businesses = await Business.find(filter)
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
        }

        // Get distinct values for filter options
        const [categories, cities] = await Promise.all([
            Business.distinct('category'),
            Business.distinct('city'),
        ])

        return NextResponse.json({
            businesses,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            filters: {
                categories: categories.sort(),
                cities: cities.sort(),
            },
            userLocation: userCity ? { city: userCity, area: userArea } : null,
        })
    } catch (err: unknown) {
        console.error('Search error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
