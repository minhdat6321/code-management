const { body, param } = require('express-validator');

const validateCreateUser = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),
  body('role')
    .optional()
    .isIn(['employee', 'manager']).withMessage('Role must be either "employee" or "manager"')
];

const validateUserId = [
  param('targetId')
    .notEmpty().withMessage('Employee ID is required')
    .isMongoId().withMessage('Invalid Employee ID format')
];

const validateUpdateUser = [
  param('targetId')
    .notEmpty().withMessage('Employee ID is required')
    .isMongoId().withMessage('Invalid Employee ID format'),
  body('name')
    .optional()
    .isString().withMessage('Name must be a string'),
  body('role')
    .optional()
    .isIn(['employee', 'manager']).withMessage('Role must be either "employee" or "manager"')
];

const validateDeleteUser = [
  param('targetId')
    .notEmpty().withMessage('Employee ID is required')
    .isMongoId().withMessage('Invalid Employee ID format')
];

module.exports = {
  validateCreateUser,
  validateUserId,
  validateUpdateUser,
  validateDeleteUser
};