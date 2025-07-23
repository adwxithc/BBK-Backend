import { Router } from 'express';
import { body } from 'express-validator';
export function eventsRoutes(router: Router) {
    router.post('/upload-media', [
        body('title')
            .notEmpty()
            .withMessage('Title is required')
            .isString()
            .withMessage('Title must be a string')
            .isLength({ max: 100 })
            .withMessage('Title must not exceed 100 characters'),

        body('description')
            .notEmpty()
            .withMessage('Description is required')
            .isString()
            .withMessage('Description must be a string')
            .isLength({ max: 1000 })
            .withMessage('Description must not exceed 1000 characters'),

        body('photos')
            .optional()
            .isArray({ max: 50 })
            .withMessage('Photos must be an array with up to 50 items'),

        body('videos')
            .optional()
            .isArray({ max: 10 })
            .withMessage('Videos must be an array with up to 10 items'),
    ]);
}
