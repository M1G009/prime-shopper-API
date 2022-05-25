const Schema = mongoose.Schema

const HomePageSlidersSchema = new Schema({
    image: {
        type: String,
        required: [true, "Please add brand image"]
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

const HomeOffers = mongoose.model('topSelectedBrandSlider', HomePageSlidersSchema)

module.exports = HomeOffers