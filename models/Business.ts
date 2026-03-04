import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IBusiness extends Document {
    _id: mongoose.Types.ObjectId
    owner: mongoose.Types.ObjectId          // ref → User
    businessName: string
    category: string
    description: string
    phone: string
    email: string
    website?: string
    address: string
    city: string
    state: string
    pincode: string
    area: string                             // neighbourhood / locality
    openingHours: string
    images: string[]                         // stored file paths
    averageRating: number
    totalReviews: number
    createdAt: Date
    updatedAt: Date
}

const BusinessSchema = new Schema<IBusiness>(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        businessName: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        website: { type: String, trim: true, default: '' },
        address: { type: String, required: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        pincode: { type: String, required: true, trim: true },
        area: { type: String, required: true, trim: true },
        openingHours: { type: String, default: '' },
        images: [{ type: String }],
        averageRating: { type: Number, default: 0, min: 0, max: 5 },
        totalReviews: { type: Number, default: 0, min: 0 },
    },
    { timestamps: true }
)

const Business: Model<IBusiness> =
    mongoose.models.Business || mongoose.model<IBusiness>('Business', BusinessSchema)

export default Business
