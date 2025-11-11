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
