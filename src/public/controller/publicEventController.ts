import { Req, Res } from '@common/types/expressTypes';
import { mediaUpload } from '@common/services/mediaUpload';
import publicEventRepository from '../repository/publicEventRepository';
import { BadRequestError } from '@common/errors/bad-request-error';
import publicEventCategoryRepository from 'public/repository/publicEventCategoryRepository';

class PublicEventController {
    async getPublishedEvents(req: Req, res: Res) {
        const {
            categoryId,
            featured,
            search,
            page = '1',
            limit = '12',
        } = req.query;

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        const options: any = {
            limit: limitNum,
            skip,
        };

        if (categoryId) {
            options.categoryId = categoryId;
        }
        if (featured !== undefined) {
            options.featured = featured === 'true';
        }
        if (search) {
            options.search = search;
        }

        const [events, total] = await Promise.all([
            publicEventRepository.findPublishedEvents(options),
            publicEventRepository.countPublishedEvents({
                ...(categoryId && { categoryId: categoryId as string }),
                ...(featured !== undefined && {
                    featured: featured === 'true',
                }),
                ...(search && { search: search as string }),
            }),
        ]);

        const responseEvents = events.map((event) => ({
            _id: event._id,
            title: event.title,
            description: event.description,
            slug: event.slug,
            categoryId: event.categoryId,
            category: event.category,
            date: event.date,
            endDate: event.endDate,
            time: event.time,
            location: event.location,
            coverImage: event.coverImage
                ? mediaUpload.getMediaUrl(event.coverImage)
                : null,
            featured: event.featured,
            createdAt: event.createdAt,
            medias:
                event.medias?.map((media) => ({
                    _id: media._id,
                    featured: media.featured,
                    caption: media.caption,
                    type: media.type,
                    url: mediaUpload.getMediaUrl(media.key),
                })) || [],
        }));

        res.status(200).json({
            success: true,
            data: {
                events: responseEvents,
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(total / limitNum),
                    totalItems: total,
                    itemsPerPage: limitNum,
                },
            },
        });
    }

    async getPublishedEventDetails(req: Req, res: Res) {
        const { eventSlug } = req.params;
        const event = await publicEventRepository.findEventBySlug(eventSlug);
        if (!event) {
            throw new BadRequestError('Event not found');
        }
        const eventResponse = {
            ...event,
            coverImage: event.coverImage
                ? mediaUpload.getMediaUrl(event.coverImage)
                : undefined,
            medias:
                event.medias?.map((media) => ({
                    _id: media._id,
                    featured: media.featured,
                    caption: media.caption,
                    type: media.type,
                    url: mediaUpload.getMediaUrl(media.key),
                })) || [],
        };
        res.status(200).json({
            success: true,
            data: eventResponse,
        });
    }

    async getEventsByCategory(req: Req, res: Res) {
        const { categorySlug, featured, search } = req.params;
        const { page = '1', limit = '12' } = req.query;

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        const categoryExists =
            await publicEventCategoryRepository.findCategoryBySlug(
                categorySlug
            );
        if (!categoryExists) {
            throw new BadRequestError('Invalid category slug');
        }
        const options: any = {
            limit: limitNum,
            skip,
            categoryId: categoryExists._id,
        };

        if (featured !== undefined) {
            options.featured = featured === 'true';
        }
        if (search) {
            options.search = search;
        }

        const [events, total] = await Promise.all([
            publicEventRepository.findPublishedEvents(options),
            publicEventRepository.countPublishedEvents({
                categoryId: categoryExists._id as string,
                ...(featured !== undefined && {
                    featured: featured === 'true',
                }),
                ...(search && { search: search as string }),
            }),
        ]);

        const responseEvents = events.map((event) => ({
            _id: event._id,
            title: event.title,
            description: event.description,
            slug: event.slug,
            categoryId: event.categoryId,
            category: event.category,
            date: event.date,
            endDate: event.endDate,
            time: event.time,
            location: event.location,
            coverImage: event.coverImage
                ? mediaUpload.getMediaUrl(event.coverImage)
                : null,
            featured: event.featured,
            createdAt: event.createdAt,
            medias:
                event.medias?.map((media) => ({
                    _id: media._id,
                    featured: media.featured,
                    caption: media.caption,
                    type: media.type,
                    url: mediaUpload.getMediaUrl(media.key),
                })) || [],
        }));

        res.status(200).json({
            success: true,
            data: {
                events: responseEvents,
                category: categoryExists,
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(total / limitNum),
                    totalItems: total,
                    itemsPerPage: limitNum,
                },
            },
        });
    }
}

export default new PublicEventController();
