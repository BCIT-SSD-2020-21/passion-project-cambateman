const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const athleteSchema = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Athlete = require('../models/athlete');

const validateAthlete = (req, res, next) => {
    const { error } = athleteSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const athletes = await Athlete.find({});
    res.render('athletes/index', { athletes })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('athletes/new');
})


router.post('/', isLoggedIn, validateAthlete, catchAsync(async (req, res, next) => {
    const athletes = new Athlete(req.body.athlete);
    await athlete.save();
    req.flash('success', 'Successfully made a new Athlete!');
    res.redirect(`/athletes/${athlete._id}`)
}))

router.get('/:id', catchAsync(async (req, res,) => {
    const athlete = await Athlete.findById(req.params.id).populate('reviews');
    if (!athletes) {
        req.flash('error', 'Cannot find that athlete!');
        return res.redirect('/athletes');
    }
    res.render('athletes/show', { athlete });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const athlete = await Athlete.findById(req.params.id)
    if (!athletes) {
        req.flash('error', 'Cannot find that athlete!');
        return res.redirect('/athletes');
    }
    res.render('athletes/edit', { athletes });
}))

router.put('/:id', isLoggedIn, validateAthlete, catchAsync(async (req, res) => {
    const { id } = req.params;
    const athlete = await Athlete.findByIdAndUpdate(id, { ...req.body.athletes });
    req.flash('success', 'Successfully updated athlete!');
    res.redirect(`/athletes/${athlete._id}`)
}));


router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Athlete.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted athlete')
    res.redirect('/athletes');
}));

module.exports = router;