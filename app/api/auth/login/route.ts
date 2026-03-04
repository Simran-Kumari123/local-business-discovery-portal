import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
        }

        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
        }

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
        }

        const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role, name: user.name })

        const res = NextResponse.json(
            { message: 'Logged in successfully', user: { id: user._id, name: user.name, email: user.email, role: user.role } },
            { status: 200 }
        )

        res.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        return res
    } catch (err: unknown) {
        console.error('Login error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
