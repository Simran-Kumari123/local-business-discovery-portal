import { NextRequest, NextResponse } from 'next/server'

// GET /api/places/details?placeId=...
// Returns detailed info about a specific place from Google Places API

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
        const placeId = searchParams.get('placeId')

        if (!placeId) {
            return NextResponse.json(
                { error: 'Place ID is required' },
                { status: 400 }
            )
        }

        const fields = 'name,formatted_address,formatted_phone_number,website,opening_hours,geometry,rating,user_ratings_total,photos,reviews,price_level,types,url,business_status'
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}&language=en`

        const response = await fetch(url)
        const data = await response.json()

        if (data.status !== 'OK') {
            return NextResponse.json(
                { error: `Google Places API error: ${data.status}` },
                { status: 502 }
            )
        }

        const place = data.result
        const photos = (place.photos || []).slice(0, 5).map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (p: any) => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${p.photo_reference}&key=${apiKey}`
        )

        return NextResponse.json({
            placeId,
            name: place.name,
            address: place.formatted_address,
            phone: place.formatted_phone_number || '',
            website: place.website || '',
            location: {
                lat: place.geometry?.location?.lat,
                lng: place.geometry?.location?.lng,
            },
            rating: place.rating || 0,
            totalRatings: place.user_ratings_total || 0,
            priceLevel: place.price_level,
            types: place.types || [],
            openNow: place.opening_hours?.open_now ?? null,
            openingHours: place.opening_hours?.weekday_text || [],
            photos,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            reviews: (place.reviews || []).slice(0, 5).map((r: any) => ({
                author: r.author_name,
                rating: r.rating,
                text: r.text,
                time: r.relative_time_description,
                profilePhoto: r.profile_photo_url,
            })),
            googleMapsUrl: place.url || '',
            businessStatus: place.business_status,
        })
    } catch (err: unknown) {
        console.error('Place details error:', err)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
