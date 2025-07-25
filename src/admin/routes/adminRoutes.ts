import { Router } from 'express';
import { validateRequest } from '@common/middlewares/validateRequest';
import { adminController } from '../controller/adminController';
import { asyncHandler } from '@common/utils/asyncHandler';
import {
    createEventValidations,
    createMediaSignedUrlValidations,
    loginValidations,
} from '../validations/api';

export function adminRouter(router: Router) {
    router.post(
        '/login',
        loginValidations,
        validateRequest,
        asyncHandler(adminController.login)
    );

    router.post('/logout', adminController.logout);
    router.post(
        '/event-media/signed-url',
        createMediaSignedUrlValidations,
        validateRequest,
        asyncHandler(adminController.getSignedUrl)
    );
    router.post(
        '/event/create',
        createEventValidations,
        validateRequest,
        asyncHandler(adminController.createEvent)
    );

    return router;
}
