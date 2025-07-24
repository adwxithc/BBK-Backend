import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@common/middlewares/validateRequest';
import { adminController } from '../controller/adminController';
import { asyncHandler } from '@common/utils/asyncHandler';

export function adminRouter(router: Router) {
    router.post(
        '/login',
        [
            body('email').isEmail().withMessage('Email must be valid'),
            body('password')
                .trim()
                .isLength({ min: 4, max: 20 })
                .withMessage('password must be between 4 and 20 characters'),
        ],
        validateRequest,
        asyncHandler(adminController.login)
    );

    router.post('/logout', adminController.logout);
    router.post(
        '/media/signed-url',
        [
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

            body('photos.*.contentType')
                .if(body('photos').exists())
                .notEmpty()
                .withMessage('Photo contentType is required for each photo')
                .isString()
                .withMessage('Photo contentType must be a string'),

            body('videos')
                .optional()
                .isArray({ max: 10 })
                .withMessage('Videos must be an array with up to 10 items'),

            body('videos.*.contentType')
                .if(body('videos').exists())
                .notEmpty()
                .withMessage('Video contentType is required for each video')
                .isString()
                .withMessage('Video contentType must be a string'),
            body('videos.*.size')
                .if(body('videos').exists())
                .notEmpty()
                .withMessage('Video size is required for each video')
                .isNumeric()
                .withMessage('Video size must be a number (in MB)')
                .custom((size) => size > 0 && size <= 1024)
                .withMessage('Video size must be between 1MB and 1024MB (1GB)'),
        ],
        validateRequest,
        asyncHandler(adminController.getSignedUrl)
    );

    return router;
}
