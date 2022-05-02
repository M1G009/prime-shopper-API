const Schema = mongoose.Schema
// multiple seller, order (remove), billing address
const PaymentSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'Users'
    },
    seller : [{
        type : Schema.Types.ObjectId,
        ref : 'Sellers'
    }],
    paymentID : {
        type : String,
        default : ''
    },
    paymentStatus : {
        type : String,
        enum : ['Pending','Paid','Unpaid','Failed'],
        default : 'Pending'
    },
    paymentType : {
        type : String,
        enum : ['COD','Stripe', 'Razorpay'],
        required : true,
    },
    paymentToken : {
        type : String,
        default : ''
    },
    paymentReceipt : {
        type : String,
        default : ''
    },
    billingAddress : {
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
    paymentDetails : {},
    invoiceNumber : {
        type : String,
        required : true,
    },
    amount : {
        type : Number,
        required : true
    },
    sellingAmount : {
        type : Number,
        required : true
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

const PaymentModel = mongoose.model('Payments',PaymentSchema)

module.exports = PaymentModel