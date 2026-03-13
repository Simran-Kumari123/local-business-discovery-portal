import { NextRequest, NextResponse } from 'next/server'

// Google Places API — Text Search (New)
// Docs: https://developers.google.com/maps/documentation/places/web-service/text-search

export async function GET(req: NextRequest) {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Google Maps API key not configured' },
                { status: 500 }
            )
        }

        const { searchParams } = new URL(req.url)
        const query = searchParams.get('q')?.trim() || ''
        const lat = searchParams.get('lat')
        const lng = searchParams.get('lng')
        const radius = searchParams.get('radius') || '5000' // default 5km
        const type = searchParams.get('type') || '' // e.g., restaurant, gym

        if (!query) {
            return NextResponse.json(
                { error: 'Search query is required' },
                { status: 400 }
            )
        }

        // Build the Google Places Text Search URL
        let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`

        // If user's location is provided, bias results to that area
        if (lat && lng) {
            url += `&location=${lat},${lng}&radius=${radius}`
        }

        // If a specific type is requested
        if (type) {
            url += `&type=${type}`
        }

        // Add language for India
        url += `&language=en&region=in`

        const response = await fetch(url)
        const data = await response.json()

        if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
            console.error('Google Places API error:', data.status, data.error_message)
            return NextResponse.json(
                { error: `Google Places API error: ${data.status}` },
                { status: 502 }
            )
        }

        // Transform results into a clean format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const places = (data.results || []).map((place: any) => ({
            placeId: place.place_id,
            name: place.name,
            address: place.formatted_address || '',
            location: {
                lat: place.geometry?.location?.lat,
                lng: place.geometry?.location?.lng,
            },
            rating: place.rating || 0,
            totalRatings: place.user_ratings_total || 0,
            priceLevel: place.price_level,
            types: place.types || [],
            openNow: place.opening_hours?.open_now ?? null,
            photo: place.photos?.[0]
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
                : null,
            icon: place.icon,
            businessStatus: place.business_status,
        }))

        return NextResponse.json({
            places,
            total: places.length,
            query,
        })
    } catch (err: unknown) {
        console.error('Places search error:', err)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
