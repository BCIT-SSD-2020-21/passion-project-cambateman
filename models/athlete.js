const mongoose = require('mongoose');
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

module.exports = mongoose.model('Athlete', AthleteSchema);