const Joi = require('joi');
const { number } = require('joi');

module.exports.AthleteSchema = Joi.object({
    athlete: Joi.object({
        name: Joi.string().required(),
        image: Joi.string().required(),
        sport: Joi.string().required(),
        graduationYear: Joi.number().required().min(2000),
        highSchool: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
})