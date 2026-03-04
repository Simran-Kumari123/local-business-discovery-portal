import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICategory extends Document {
    _id: mongoose.Types.ObjectId
    name: string
    slug: string
    icon: string
    description: string
    createdAt: Date
    updatedAt: Date
}

const CategorySchema = new Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        icon: { type: String, default: '🏢' },
        description: { type: String, default: '' },
    },
    { timestamps: true }
)

// Auto-generate slug from name before saving
CategorySchema.pre('save', function () {
    if (this.isModified('name') && !this.slug) {
        this.slug = (this.name as string)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }
})

const Category: Model<ICategory> =
    mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema)

export default Category
