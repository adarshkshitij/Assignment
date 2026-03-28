const { body, param, query } = require('express-validator');

const taskStatuses = ['pending', 'in-progress', 'completed'];
const taskPriorities = ['low', 'medium', 'high'];
const userRoles = ['user', 'admin'];

exports.registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(userRoles)
    .withMessage('Role must be either user or admin'),
  body('adminCode')
    .optional()
    .isString()
    .withMessage('Admin code must be a string'),
];

exports.loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

exports.createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  body('status')
    .optional()
    .isIn(taskStatuses)
    .withMessage('Status must be pending, in-progress, or completed'),
  body('priority')
    .optional()
    .isIn(taskPriorities)
    .withMessage('Priority must be low, medium, or high'),
];

exports.updateTaskValidation = [
  param('id')
    .isMongoId()
    .withMessage('Task id must be a valid MongoDB id'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  body('status')
    .optional()
    .isIn(taskStatuses)
    .withMessage('Status must be pending, in-progress, or completed'),
  body('priority')
    .optional()
    .isIn(taskPriorities)
    .withMessage('Priority must be low, medium, or high'),
];

exports.taskIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Task id must be a valid MongoDB id'),
];

exports.taskQueryValidation = [
  query('status')
    .optional()
    .isIn(taskStatuses)
    .withMessage('Status filter must be pending, in-progress, or completed'),
  query('priority')
    .optional()
    .isIn(taskPriorities)
    .withMessage('Priority filter must be low, medium, or high'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('sort')
    .optional()
    .isString()
    .withMessage('Sort must be a string'),
];
