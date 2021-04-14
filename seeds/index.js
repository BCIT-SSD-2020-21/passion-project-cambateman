const mongoose = require('mongoose');
const cities = require('./cities');
const { highSchools, postGrad, firstNames, lastNames, sports, graduationsYears } = require('./seedHelpers');
const Athlete = require('../models/athlete');

mongoose.connect('mongodb://localhost:27017/scouting', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Coneected")
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Athlete.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const athlete = new Athlete({
            name: `${sample(firstNames)} ${sample(lastNames)}`,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrucfhOvSABTWfUdIfHQ4c4Mfs7pA0DzFmZA&usqp=CAU',
            sport: `${sample(sports)}`,
            graduationYear: `${sample(graduationsYears)}`,
            highSchool: `${sample(highSchools)}`,
            // postGrad: `${sample(postGrad)}`,
            // city: `${cities[random1000].city}, ${cities[random1000].state}`
        })
        await athlete.save()
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});