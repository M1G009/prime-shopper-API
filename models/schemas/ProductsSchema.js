const Schema = mongoose.Schema

const ProductsSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categories'
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Sellers',
        default: null
    },
    title: {
        type: String,
        required: true
    },
    banner: {
        type: String,
        default: ''
    },
    images: [],
    price: {
        type: String,
        required: true
    },
    sellingPrice: {
        type: String,
        required: true
    },
    discount: {
        type: String,
        default: ''
    },
    SKU: {
        type: String,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    description: {
        type: String,
        default: ''
    },
    features: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['In stock', 'Out of stock'],
        default: 'In stock'
    },
    productStatus: {
        type: String,
        enum: ['Active', 'Inactive', 'Draft'],
        default: 'Active'
    },
    slug: {
        type: String,
        unique: true
    },
    productOtherDetails: [],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    UpdatedAt: {
        type: Date,
        default: Date.now()
    },
})

ProductsSchema.virtual('isFavorite', {
    ref: 'Favorites', // The model to use
    localField: '_id', // Find people where `localField`
    foreignField: 'product', // is equal to `foreignField`
    justOne: true,
});

ProductsSchema.set('toObject', { virtuals: true })
ProductsSchema.set('toJSON', { virtuals: true })

const ProductsModel = mongoose.model('Products', ProductsSchema)

module.exports = ProductsModel