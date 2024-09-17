const { body, param } = require('express-validator');

// Validation for creating a task
const validateCreateTask = [
  body('name')
    .notEmpty().withMessage('Task name is required')
    .isString().withMessage('Task name must be a string'),
  body('description')
    .notEmpty().withMessage('Task description is required')
    .isString().withMessage('Task description must be a string'),
  body('status')
    .optional()
    .isIn(['pending', 'working', 'review', 'done', 'archive'])
    .withMessage('Invalid status value. Must be one of: pending, working, review, done, archive')
];

// Validation for MongoDB ObjectId (task ID)
const validateTaskId = [
  param('targetId')
    .notEmpty().withMessage('Task ID is required')
    .isMongoId().withMessage('Invalid Task ID format')
];

// Validation for updating a task
const validateUpdateTask = [
  param('targetId')
    .notEmpty().withMessage('Task ID is required')
    .isMongoId().withMessage('Invalid Task ID format'),
  body('status')
    .optional()
    .isIn(['pending', 'working', 'review', 'done', 'archive'])
    .withMessage('Invalid status value. Must be one of: pending, working, review, done, archive'),

];

// Exporting the validators
module.exports = {
  validateCreateTask,
  validateTaskId,
  validateUpdateTask,
};