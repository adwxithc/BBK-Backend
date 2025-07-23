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

    return router;
}
