import { Router } from 'express';
import { asyncHandler } from '@common/utils/asyncHandler';
import publicEventController from '../controller/publicEventController';
import publicEventCategoryController from '../controller/publicEventCategoryController';
import { validateRequest } from '@common/middlewares/validateRequest';
import {
    validateGetEventCategories,
    validateGetEventsByCategory,
    validateGetPublishedEvents,
} from 'public/validations/api';

export const publicRouter = (router: Router) => {
    // Event routes
    router.get(
        '/events',
        validateGetPublishedEvents,
        validateRequest,
        asyncHandler(publicEventController.getPublishedEvents)
    );
    router.get(
        '/events/category/:categorySlug',
        validateGetEventsByCategory,
        validateRequest,
        asyncHandler(publicEventController.getEventsByCategory)
    );

    // Event category routes
    router.get(
        '/categories',
        validateGetEventCategories,
        validateRequest,
        asyncHandler(publicEventCategoryController.getActiveCategories)
    );
    router.get(
        '/categories/all',
        validateGetEventCategories,         
        validateRequest,
        asyncHandler(publicEventCategoryController.getAllActiveCategories)
    );

    return router;
};
