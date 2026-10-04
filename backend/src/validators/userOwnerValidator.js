const { body, param } = require('express-validator');

const ratingValidationRules = [
  body('storeId')
    .notEmpty()
    .withMessage('Store ID is required')
    .isInt({ min: 1 })
    .withMessage('Store ID must be a valid integer'),
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
];

const updateRatingValidationRules = [
  param('id')
    .notEmpty()
    .withMessage('Rating ID is required')
    .isInt({ min: 1 })
    .withMessage('Rating ID must be a valid integer'),
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
];

module.exports = {
  ratingValidationRules,
  updateRatingValidationRules,
};
