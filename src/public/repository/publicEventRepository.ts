import EventModel from '@common/model/eventModel';
import EventCategory, {
    IEventCategory,
} from '@common/model/eventCategoryModel';
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
            .sort({ featured: -1, date: 1, createdAt: -1 })
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
            .select('_id title description slug categoryId category date endDate time location coverImage featured createdAt updatedAt medias')
            .lean();
    }
}

export default new PublicEventRepository();
