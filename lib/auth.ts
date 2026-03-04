import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET!

export interface JwtPayload {
    userId: string
    email: string
}

/** Create a signed JWT token */
export function signToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

/** Verify and decode a JWT token */
export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload
    } catch {
        return null
    }
}

/** Read the current user from the auth cookie (for server components / route handlers) */
export async function getCurrentUser(): Promise<JwtPayload | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null
    return verifyToken(token)
}
