const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .matches(/^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)
    .withMessage('Password must be 8-16 characters with at least one uppercase letter and one special character'),
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const validateUserCreation = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .matches(/^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)
    .withMessage('Password must be 8-16 characters with at least one uppercase letter and one special character'),
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  body('role')
    .isIn(['ADMIN', 'USER', 'OWNER'])
    .withMessage('Role must be ADMIN, USER, or OWNER'),
];

const validateStoreCreation = [
  body('name')
    .notEmpty()
    .withMessage('Store name is required'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('address')
    .notEmpty()
    .withMessage('Store address is required'),
];

const validateRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
];

const validatePasswordChange = [
  body('newPassword')
    .matches(/^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)
    .withMessage('New password must be 8-16 characters with at least one uppercase letter and one special character'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateUserCreation,
  validateStoreCreation,
  validateRating,
  validatePasswordChange,
  handleValidationErrors,
};
