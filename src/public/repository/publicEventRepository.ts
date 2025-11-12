import EventModel from '@common/model/eventModel';
import EventCategory from '@common/model/eventCategoryModel';
import { IEvent } from '@common/types/data';

interface PublicEventOptions {
    limit?: number;
    skip?: number;
    categoryId?: string;
    featured?: boolean;
    search?: string;
}

interface PublicEventCountOptions {
    categoryId?: string;
    featured?: boolean;
    search?: string;
}

class PublicEventRepository {
    async findPublishedEvents(options: PublicEventOptions): Promise<IEvent[]> {
        const { limit = 10, skip = 0, categoryId, featured, search } = options;

        const query: any = {
            status: 'published',
            isDeleted: false,
            date: { $gte: new Date() }, // Only future events
        };

        if (categoryId) {
            query.categoryId = categoryId;
        }

        if (featured !== undefined) {
            query.featured = featured;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
            ];
        }

        return await EventModel.find(query)
            .populate('category', 'name slug color')
            .sort({ date: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
    }

    async countPublishedEvents(
        options: PublicEventCountOptions
    ): Promise<number> {
        const { categoryId, featured, search } = options;

        const query: any = {
            status: 'published',
            isDeleted: false,
            date: { $gte: new Date() }, // Only future events
        };

        if (categoryId) {
            query.categoryId = categoryId;
        }

        if (featured !== undefined) {
            query.featured = featured;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
            ];
        }

        return await EventModel.countDocuments(query);
    }

    async findEventBySlug(slug: string): Promise<IEvent | null> {
        return await EventModel.findOne({
            slug,
            status: 'published',
            isDeleted: false,
        })
            .populate('category', 'name slug color description')
            .lean();
    }

    async aggregateEventsByCategory(
        categorySlug: string,
        options: { limit?: number; skip?: number } = {}
    ): Promise<{ events: IEvent[]; metadata: { total: number } }> {
        const { limit = 10, skip = 0 } = options;

        const results = await EventCategory.aggregate([
            {
                $match: {
                    slug: categorySlug,
                    isActive: true,
                    isDeleted: false,
                },
            },
            {
                $facet: {
                    metadata: [{ $count: 'total' }],
                    events: [
                        {
                            $lookup: {
                                from: 'events',
                                localField: '_id',
                                foreignField: 'categoryId',
                                as: 'events',
                            },
                        },
                        {
                            $unwind: '$events',
                        },
                        {
                            $sort: {
                                'events.date': -1,
                                'events.createdAt': -1,
                            },
                        },
                        {
                            $skip: skip,
                        },
                        {
                            $limit: limit,
                        },
                    ],
                },
            },
        ]);
        const data =
            results.length > 0
                ? results[0]
                : { metadata: { total: 0 }, events: [] };
        const { metadata, events } = data;

        return { events, metadata: metadata[0] } as {
            events: IEvent[];
            metadata: { total: number };
        };
    }
}

export default new PublicEventRepository();
