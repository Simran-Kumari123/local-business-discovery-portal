import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Business from '@/models/Business'
import { getCurrentUser } from '@/lib/auth'

interface Params {
    params: Promise<{ id: string }>
}

// GET — fetch a single business by ID
export async function GET(_req: NextRequest, { params }: Params) {
    try {
        const { id } = await params
        await dbConnect()
        const business = await Business.findById(id)
        if (!business) {
            return NextResponse.json({ error: 'Business not found' }, { status: 404 })
        }
        return NextResponse.json({ business })
    } catch (err: unknown) {
        console.error('Fetch business error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PUT — update a business (only the owner can update)
export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const payload = await getCurrentUser()
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        await dbConnect()

        const business = await Business.findById(id)
        if (!business) {
            return NextResponse.json({ error: 'Business not found' }, { status: 404 })
        }

        // Only the owner can edit
        if (business.owner.toString() !== payload.userId) {
            return NextResponse.json({ error: 'Forbidden — you can only edit your own business' }, { status: 403 })
        }

        const body = await req.json()
        const updated = await Business.findByIdAndUpdate(id, body, { new: true, runValidators: true })

        return NextResponse.json({ message: 'Business updated successfully', business: updated })
    } catch (err: unknown) {
        console.error('Update business error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE — delete a business (only the owner)
export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const payload = await getCurrentUser()
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        await dbConnect()

        const business = await Business.findById(id)
        if (!business) {
            return NextResponse.json({ error: 'Business not found' }, { status: 404 })
        }

        if (business.owner.toString() !== payload.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        await Business.findByIdAndDelete(id)
        return NextResponse.json({ message: 'Business deleted successfully' })
    } catch (err: unknown) {
        console.error('Delete business error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
