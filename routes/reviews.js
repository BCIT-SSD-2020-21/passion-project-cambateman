const express = require('express');
const router = express.Router({ mergeParams: true });

const Athlete = require('../models/athlete'); 
const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js');


const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}



router.post('/', validateReview, catchAsync(async (req, res) => {
    const athlete = await Athlete.findById(req.params.id);
    const review = new Review(req.body.review);
    athlete.reviews.push(review);
    await review.save();
    await athlete.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/athletes/${athlete._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Athlete.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/athletes/${id}`);
}))

module.exports = router;
