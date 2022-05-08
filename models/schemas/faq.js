const Schema = mongoose.Schema

const FaqSchema = new Schema({
    question : String,
    answer : String,
    created_at : {
        type : Date,
        default : Date.now
    }
})

  FaqSchema.set('toObject', { virtuals: true })
  FaqSchema.set('toJSON', { virtuals: true })
const FaqModal = mongoose.model('Faq', FaqSchema)

module.exports = FaqModal