const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
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

server.engine('ejs', ejsMate)

server.use(express.urlencoded({ extended: true }))
server.use(methodOverride('_method'));

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

server.get('/', (req, res) => {
    res.render('home')
});

server.get('/athletes', async (req, res) => {
    const athletes = await Athlete.find({});
    res.render('athletes/index', { athletes })
});

server.get('/athletes/new', (req, res) => {
    res.render('athletes/new')
})

server.post('/athletes', async (req, res) => {
    const athlete = new Athlete(req.body.athlete)
    await athlete.save();
    res.redirect(`/athletes/${athlete._id}`)
})

server.get('/athletes/:id', async (req, res) => {
    const athlete = await Athlete.findById(req.params.id)
    res.render('athletes/show', { athlete })
})

server.get('/athletes/:id/edit', async (req, res) => {
    const athlete = await Athlete.findById(req.params.id)
    res.render('athletes/edit', { athlete })
})

server.put('/athletes/:id', async (req, res) => {
    const { id } = req.params;
    const athlete = await Athlete.findByIdAndUpdate(id, { ...req.body.athlete });
    res.redirect(`/athletes/${athlete._id}`)
});

server.delete('/athletes/:id', async (req, res) => {
    const { id } = req.params;
    await Athlete.findByIdAndDelete(id);
    res.redirect('/athletes');
})

server.listen(8080, () => {
    console.log("Serving on port 8080")
});