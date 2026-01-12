import { body, query, param } from 'express-validator';
export const validateGetPublishedEvents = [
    query('categoryId')
        .optional()
        .isMongoId()
        .withMessage('Category ID must be a valid MongoDB ObjectId'),
    query('featured')
        .optional()
        .isBoolean()
        .withMessage('Featured must be a boolean value'),
    query('search')
        .optional()
        .isString()
        .withMessage('Search must be a string'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Limit must be a positive integer')
        .toInt(),
];
export const validateGetPublishedEvent=[
    param('eventSlug')
        .isString()
        .withMessage('Event slug must be a string'),
]
export const validateGetEventsByCategory = [
    param('categorySlug')
        .isString()
        .withMessage('Category slug must be a string'),
    query('featured')
        .optional()
        .isBoolean()
        .withMessage('Featured must be a boolean value'),
    query('search')
        .optional()
        .isString()
        .withMessage('Search must be a string'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Limit must be a positive integer')
        .toInt(),
];

export const validateGetEventCategories = [
    query('search')
        .optional()
        .isString()
        .withMessage('Search must be a string'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Limit must be a positive integer')
        .toInt(),
];

export const validateSubmitContactForm = [
    body('fullName')
        .notEmpty()
        .withMessage('Full name is required')
        .isString()
        .withMessage('Full name must be a string')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail(),
    body('phone')
        .optional()
        .isString()
        .withMessage('Phone must be a string')
        .trim(),
    body('subject')
        .notEmpty()
        .withMessage('Subject is required')
        .isString()
        .withMessage('Subject must be a string')
        .trim()
        .isIn(['Enrollment Inquiry', 'Schedule a Tour', 'General Question', 'Feedback', 'Other'])
        .withMessage('Subject must be one of: Enrollment Inquiry, Schedule a Tour, General Question, Feedback, Other'),
    body('message')
        .notEmpty()
        .withMessage('Message is required')
        .isString()
        .withMessage('Message must be a string')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Message must be between 10 and 2000 characters'),
];
