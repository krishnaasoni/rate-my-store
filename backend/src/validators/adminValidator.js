const { body, query } = require('express-validator');

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

const createUserValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ max: 400 })
    .withMessage('Address cannot exceed 400 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .matches(PASSWORD_REGEX)
    .withMessage(
      'Password must be 8 to 16 characters and contain at least one uppercase letter and one special character'
    ),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['ADMIN', 'USER', 'STORE_OWNER'])
    .withMessage('Role must be ADMIN, USER, or STORE_OWNER'),
];

const createStoreValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Store name is required')
    .isLength({ min: 3, max: 60 })
    .withMessage('Store name must be between 3 and 60 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Store email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Store address is required')
    .isLength({ max: 400 })
    .withMessage('Store address cannot exceed 400 characters'),
  body('ownerId')
    .notEmpty()
    .withMessage('Owner ID is required')
    .isInt({ min: 1 })
    .withMessage('Owner ID must be a valid integer'),
];

module.exports = {
  createUserValidationRules,
  createStoreValidationRules,
};
