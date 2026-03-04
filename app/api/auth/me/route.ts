import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
    try {
        const payload = await getCurrentUser()
        if (!payload) {
            return NextResponse.json({ user: null }, { status: 401 })
        }

        await dbConnect()
        const user = await User.findById(payload.userId).select('-password')
        if (!user) {
            return NextResponse.json({ user: null }, { status: 401 })
        }

        return NextResponse.json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        })
    } catch (err: unknown) {
        console.error('Auth check error:', err)
        return NextResponse.json({ user: null }, { status: 500 })
    }
}
