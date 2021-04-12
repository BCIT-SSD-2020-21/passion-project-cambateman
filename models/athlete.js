const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AthleteSchema = new Schema({
    Name: String,
    Sport: String,
    GraduationYear: Number,
    HighSchool: String,
    PostGrad: Boolean
});

module.exports = mongoose.model('Athlete', AthleteSchema);