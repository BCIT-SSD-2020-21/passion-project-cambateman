const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Athlete = require('./models/athlete');

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

const server = express();


server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

server.get('/', (req, res) => {
    res.render('home')
});

server.get('/athletes', async (req, res) => {
    const athletes = await Athlete.find({});
    res.render('athletes/index', { athletes })
});

server.get('/athletes/:id', async (req, res) => {
    const athlete = await Athlete.findById(req.params.id)
    res.render('athletes/show', { athlete })
})



// server.get('/makeathlete', async (req, res) => {
//     const athlete = new Athlete({ Name: "Cam Bateman", Sport: "Lacrosse", GraduationYear: 2017, HighSchool: "Heritage Woods", PostGrad: false, City: "Vancouver"});
//     await athlete.save();
//     res.send(athlete)
// });

server.listen(8080, () => {
    console.log("Serving on port 8080")
});