import { Router } from 'express';
import { asyncHandler } from '@common/utils/asyncHandler';
import publicEventController from '../controller/publicEventController';
import publicEventCategoryController from '../controller/publicEventCategoryController';
import publicContactFormController from '../controller/publicContactFormController';
import { validateRequest } from '@common/middlewares/validateRequest';
import {
    validateGetEventCategories,
    validateGetEventsByCategory,
    validateGetPublishedEvent,
    validateGetPublishedEvents,
    validateSubmitContactForm,
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
        '/events/:eventSlug',
        validateGetPublishedEvent,
        validateRequest,
        asyncHandler(publicEventController.getPublishedEventDetails)
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

    // Contact form route
    router.post(
        '/contact',
        validateSubmitContactForm,
        validateRequest,
        asyncHandler(publicContactFormController.submitContactForm)
    );

    return router;
};
