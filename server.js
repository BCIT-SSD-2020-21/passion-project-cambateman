const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { athleteSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Athlete = require('./models/athlete');
const Review = require('./models/review');

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

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

server.use(express.urlencoded({ extended: true }))
server.use(methodOverride('_method'));

const validateAthlete = (req, res, next) => {
    const { error } = athleteSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

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
    const athlete = await Athlete.findById(req.params.id).populate('reviews')
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

server.post('/athletes/:id/reviews', (async (req, res) => {
    const athlete = await Athlete.findById(req.params.id);
    const review = new Review(req.body.review);
    console.log(req.body.review)
    athlete.reviews.push(review);
    await review.save();
    await athlete.save();
    res.redirect(`/athletes/${athlete._id}`);
}))

server.delete('/athletes/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Athlete.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/athletes/${id}`);
}))

server.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

server.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

server.listen(8080, () => {
    console.log("Serving on port 8080")
});