const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AthleteSchema = new Schema({
    name: String,
    image: String,
    sport: String,
    graduationYear: Number,
    highSchool: String,
    postGrad: Boolean,
    city: String
});

module.exports = mongoose.model('Athlete', AthleteSchema);