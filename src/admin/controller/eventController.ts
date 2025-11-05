import { BadRequestError } from '@common/errors/bad-request-error';
import { mediaUpload } from '@common/services/mediaUpload';
import { IEvent } from '@common/types/data';
import { Req, Res } from '@common/types/expressTypes';
import eventRepository from 'admin/repository/eventRepository';
import { time } from 'console';
import { create } from 'domain';

class EventController {
    async createEvent(req: Req, res: Res) {
        const {
            title,
            description,
            categoryId,
            date,
            endDate,
            time,
            location,
            coverImage,
            medias,
            status,
            featured,
            slug,
        } = req.body;
        const existingEvent = await eventRepository.findBySlug(slug);
        if (existingEvent) {
            throw new BadRequestError('Event with this slug already exists');
        }
        const completeMultipartUploadPromise = medias
            .filter((m: any) => m.multipart)
            .map(async (media: any) => {
                return {
                    key: await mediaUpload.completeMultipartUpload(
                        media.key,
                        media.uploadId,
                        media.parts
                    ),
                    uploadId: media.uploadId,
                };
            });

        let multipartMediaKey: { key: string; uploadId: string }[] = [];
        if (completeMultipartUploadPromise.length > 0) {
            multipartMediaKey = await Promise.all(
                completeMultipartUploadPromise
            );
        }
        const storableMediaInfo = medias.map((media: any) => {
            if (media.multipart) {
                const completedMedia = multipartMediaKey.find(
                    (m: any) => m.uploadId === media.uploadId
                );
                return {
                    featured: media.featured,
                    caption: media.caption,
                    type: media.type,
                    contentType: media.contentType,
                    key: completedMedia?.key,
                };
            }
            return {
                featured: media.featured,
                caption: media.caption,
                type: media.type,
                contentType: media.contentType,
                key: media.key,
            };
        });
        const event: IEvent = {
            title,
            description,
            categoryId,
            date,
            endDate,
            time,
            location,
            coverImage,
            medias: storableMediaInfo,
            status,
            featured,
            slug,
            createdBy: req.user?.email as string,
        };
        const newEvent = await eventRepository.createEvent(event);
        res.status(201).json({
            success: true,
            message: 'Event metadata stored successfully',
            data: newEvent,
        });
    }

    async getAllEvents(req: Req, res: Res) {
        const {
            status,
            search,
            page = '1',
            limit = '10',
            featured,
        } = req.query;
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        const options: any = {
            limit: limitNum,
            skip,
        };
        if (status) {
            options.status = status;
        }
        if (featured) {
            options.featured = featured;
        }
        if (search) {
            options.search = search;
        }

        const [events, total] = await Promise.all([
            eventRepository.findAll(options),
            eventRepository.count({
                ...(status && { status: status as string }),
                ...(featured && { featured: featured as string }),
                ...(search && { search: search as string }),
            }),
        ]);

        const responseEvents = events.map((event) => ({
            categoryId: event.categoryId,
            coverImage: event.coverImage
                ? mediaUpload.getMediaUrl(event.coverImage || '')
                : undefined,
            createdAt: event.createdAt,
            createdBy: event.createdBy,
            date: event.date,
            description: event.description,
            endDate: event.endDate,
            featured: event.featured,
            location: event.location,
            slug: event.slug,
            status: event.status,
            time: event.time,
            title: event.title,
            updatedAt: event.updatedAt,
            _id: event._id,
            medias: event.medias.map((media) => ({
                _id: media._id,
                featured: media.featured,
                caption: media.caption,
                type: media.type,
                contentType: media.contentType,
                key: media.key,
                url: mediaUpload.getMediaUrl(media.key),
            })),
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
}
export const eventController = new EventController();
