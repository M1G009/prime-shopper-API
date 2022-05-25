const Schema = mongoose.Schema

const HomePageSlidersSchema = new Schema({
    image: {
        type: String,
        required: [true, "Please add offer image"]
    },
    uptoOff: {
        type: String,
        required: [true, "Please add Off Percentage"]
    },
    redirectLink: {
        type: String,
        required: [true, "Please add Redirect Link"]
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

const HomeOffers = mongoose.model('bigOfferSlider', HomePageSlidersSchema)

module.exports = HomeOffers