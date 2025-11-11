import { Req, Res } from '@common/types/expressTypes';
import { mediaUpload } from '@common/services/mediaUpload';
import publicEventRepository from '../repository/publicEventRepository';
import { BadRequestError } from '@common/errors/bad-request-error';

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
                ...(featured !== undefined && { featured: featured === 'true' }),
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
            medias: event.medias?.map((media) => ({
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

    async getEventsByCategory(req: Req, res: Res) {
        const { categorySlug } = req.params;
        const { page = '1', limit = '12' } = req.query;
        
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        const events = await publicEventRepository.findEventsByCategory(
            categorySlug,
            { limit: limitNum, skip }
        );

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
        }));

        res.status(200).json({
            success: true,
            data: {
                events: responseEvents,
            },
        });
    }
}

export default new PublicEventController();