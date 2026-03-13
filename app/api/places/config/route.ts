import { NextResponse } from 'next/server'

// GET /api/places/config
// Returns the public Google Maps API key (safe to expose to client)
export async function GET() {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || ''

    return NextResponse.json({
        apiKey: apiKey,
    })
}
