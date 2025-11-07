import { Router } from 'express';
import { validateRequest } from '@common/middlewares/validateRequest';
import { adminController } from '../controller/adminController';
import eventCategoryController from '../controller/eventCategoryController';
import { asyncHandler } from '@common/utils/asyncHandler';
import {
    createEventValidations,
    createMediaSignedUrlValidations,
    loginValidations,
    createEventCategoryValidations,
    updateEventCategoryValidations,
    getEventCategoriesValidations,
    completeMultipartUploadBatchValidations,
    abortMultipartUploadValidations,
    getEventsValidations,
    updateEventValidations,
} from '../validations/api';
import protectAdmin from '@common/middlewares/protect';
import { eventController } from 'admin/controller/eventController';

export function adminRouter(router: Router) {
    router.post(
        '/login',
        loginValidations,
        validateRequest,
        asyncHandler(adminController.login)
    );

    router.post('/logout', adminController.logout);
    router.get('/check-auth', protectAdmin, adminController.checkAuth);
    router.post(
        '/event-media/signed-url',
        protectAdmin,
        createMediaSignedUrlValidations,
        validateRequest,
        asyncHandler(adminController.getSignedUrl)
    );

    router.post(
        '/event-media/complete-multipart-batch',
        protectAdmin,
        completeMultipartUploadBatchValidations,
        validateRequest,
        asyncHandler(adminController.completeMultipartUploadBatch)
    );
    router.delete(
        '/event-media/abort-multipart',
        protectAdmin,
        abortMultipartUploadValidations,
        validateRequest,
        asyncHandler(adminController.abortMultipartUpload)
    );
    router.post(
        '/event/create',
        protectAdmin,
        createEventValidations,
        validateRequest,
        asyncHandler(eventController.createEvent)
    );
    router.get(
        '/events',
        protectAdmin,
        getEventsValidations,
        validateRequest,
        asyncHandler(eventController.getAllEvents)
    );
    router.put(
        '/event/:id',
        protectAdmin,
        updateEventValidations,
        validateRequest,
        asyncHandler(eventController.updateEvent)
    );

    // Event Category Routes
    // Create a new event category
    router.post(
        '/event-category',
        protectAdmin,
        createEventCategoryValidations,
        validateRequest,
        asyncHandler(eventCategoryController.createCategory)
    );

    // Get all event categories with optional pagination and filtering
    router.get(
        '/event-category',
        protectAdmin,
        getEventCategoriesValidations,
        validateRequest,
        asyncHandler(eventCategoryController.getAllCategories)
    );

    // Update an event category
    router.put(
        '/event-category/:id',
        protectAdmin,
        updateEventCategoryValidations,
        validateRequest,
        asyncHandler(eventCategoryController.updateCategory)
    );

    // Soft delete an event category (sets isActive to false)
    router.delete(
        '/event-category/:id',
        protectAdmin,
        asyncHandler(eventCategoryController.softDeleteCategory)
    );

    return router;
}
