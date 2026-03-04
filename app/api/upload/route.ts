import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import cloudinary from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
    try {
        const payload = await getCurrentUser()
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Only JPEG, PNG, WebP or GIF images are allowed' }, { status: 400 })
        }

        // Limit file size (5 MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size must be under 5 MB' }, { status: 400 })
        }

        // Convert file to base64 data URI for Cloudinary upload
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = buffer.toString('base64')
        const dataUri = `data:${file.type};base64,${base64}`

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'localbiz/businesses',
            resource_type: 'image',
            transformation: [
                { width: 1200, height: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
            ],
        })

        return NextResponse.json({
            url: result.secure_url,
            public_id: result.public_id,
            message: 'File uploaded successfully',
        })
    } catch (err: unknown) {
        console.error('Upload error:', err)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
