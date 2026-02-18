import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const { name, email, password } = await req.json()

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
        }

        // Check if user already exists
        const existing = await User.findOne({ email: email.toLowerCase() })
        if (existing) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
        }

        // Hash password and create user
        const hashed = await bcrypt.hash(password, 12)
        const user = await User.create({ name, email: email.toLowerCase(), password: hashed })

        // Create JWT and set HTTP-only cookie
        const token = signToken({ userId: user._id.toString(), email: user.email })

        const res = NextResponse.json(
            { message: 'Account created successfully', user: { id: user._id, name: user.name, email: user.email } },
            { status: 201 }
        )

        res.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        return res
    } catch (err: unknown) {
        console.error('Signup error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
