import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Business from '@/models/Business'
import { getCurrentUser } from '@/lib/auth'

// GET — list businesses for the current user
export async function GET() {
    try {
        const payload = await getCurrentUser()
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()
        const businesses = await Business.find({ owner: payload.userId }).sort({ updatedAt: -1 })
        return NextResponse.json({ businesses })
    } catch (err: unknown) {
        console.error('Fetch businesses error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST — create a new business
export async function POST(req: NextRequest) {
    try {
        const payload = await getCurrentUser()
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await dbConnect()
        const body = await req.json()

        const requiredFields = ['businessName', 'category', 'description', 'phone', 'email', 'address', 'city', 'state', 'pincode', 'area']
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json({ error: `${field} is required` }, { status: 400 })
            }
        }

        const business = await Business.create({
            ...body,
            owner: payload.userId,
            images: body.images || [],
        })

        return NextResponse.json({ message: 'Business registered successfully', business }, { status: 201 })
    } catch (err: unknown) {
        console.error('Create business error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
