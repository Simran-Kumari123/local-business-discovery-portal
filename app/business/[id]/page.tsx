import { notFound } from 'next/navigation'
import dbConnect from '@/lib/dbConnect'
import Business from '@/models/Business'
import type { Metadata } from 'next'
import BusinessDetailClient from './BusinessDetailClient'

interface Props {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    try {
        await dbConnect()
        const business = await Business.findById(id).lean()
        if (!business) return { title: 'Business Not Found' }
        const biz = business as { businessName?: string; description?: string; city?: string }
        return {
            title: `${biz.businessName} — LocalBiz`,
            description: `${biz.description?.substring(0, 160)} | ${biz.city}`,
        }
    } catch {
        return { title: 'Business — LocalBiz' }
    }
}

async function getBusinessData(id: string) {
    try {
        await dbConnect()
        const business = await Business.findById(id).lean()
        if (!business) return null
        return JSON.parse(JSON.stringify(business))
    } catch {
        return null
    }
}

export default async function BusinessDetailPage({ params }: Props) {
    const { id } = await params
    const business = await getBusinessData(id)
    if (!business) notFound()

    return <BusinessDetailClient business={business} />
}
