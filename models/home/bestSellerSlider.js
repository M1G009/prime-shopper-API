const Schema = mongoose.Schema

const HomePageSlidersSchema = new Schema({
    image: {
        type: String,
        required: [true, "Please add image"]
    },
    redirectLink: {
        type: String,
        required: [true, "Please add Redirect Link"]
    },
    category: {
        type: String,
        required: [true, "Please add category Name"]
    },
    uptoOff: {
        type: String,
        required: [true, "Please add Off Data"]
    },
    createdAt: {
        type : Date,
        default: Date.now
    },
    updatedAt: {
        type : Date,
        default: Date.now
    }
})

const HomeOffers = mongoose.model('bestSellerSlider', HomePageSlidersSchema)

module.exports = HomeOffers