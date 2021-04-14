const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const AthleteSchema = new Schema({
    name: String,
    image: String,
    sport: String,
    graduationYear: Number,
    highSchool: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

AthleteSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Athlete', AthleteSchema);