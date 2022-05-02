const Schema = mongoose.Schema
// shipping address, payment id, Single Single Order
const OrdersSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Products',
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            },
            price: {
                type: Number,
                required: true
            },
        }
    ],
    seller : [{
        type : Schema.Types.ObjectId,
        ref : 'Sellers'
    }],
    orderNumber : {
        type: String,
    },
    note: {
        type: String,
        default: ''
    },
    sellingAmount: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Unshipped', 'Sent', 'Cancelled'],
        default: 'Pending'
    },
    courier: {
        id: {
            type: Schema.Types.ObjectId,
            ref : 'Courier'
        },
        trackingId: String
    },
    payment_id: {
        type : Schema.Types.ObjectId,
        ref : 'Payments'
    },
    shippingAddress : {
        address_city : {
            type: String,
            required: true
        },
        address_country : {
            type: String,
            required: true
        },
        address_line1 : {
            type: String,
            required: true
        },
        address_line2 : String,
        address_state : {
            type: String,
            required: true
        },
        address_zip : {
            type: String,
            required: true
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const OrdersModel = mongoose.model('Orders', OrdersSchema)

module.exports = OrdersModel