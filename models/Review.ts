import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IReview extends Document {
    _id: mongoose.Types.ObjectId
    user: mongoose.Types.ObjectId
    business: mongoose.Types.ObjectId
    rating: number
    comment: string
    createdAt: Date
    updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true, trim: true, minlength: 3, maxlength: 1000 },
    },
    { timestamps: true }
)

// Ensure one review per user per business
ReviewSchema.index({ user: 1, business: 1 }, { unique: true })

// Index for efficient queries by business
ReviewSchema.index({ business: 1, createdAt: -1 })

const Review: Model<IReview> =
    mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)

export default Review
