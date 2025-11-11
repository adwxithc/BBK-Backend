import EventCategory, { IEventCategoryDocument } from '@common/model/eventCategoryModel';

interface PublicCategoryOptions {
    limit?: number;
    skip?: number;
    search?: string;
}

interface PublicCategoryCountOptions {
    search?: string;
}

class PublicEventCategoryRepository {
    async findActiveCategories(options: PublicCategoryOptions): Promise<IEventCategoryDocument[]> {
        const { limit = 10, skip = 0, search } = options;

        const query: any = {
            isActive: true,
            isDeleted: false,
        };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        return await EventCategory.find(query)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit)
            .lean();
    }

    async countActiveCategories(options: PublicCategoryCountOptions): Promise<number> {
        const { search } = options;

        const query: any = {
            isActive: true,
            isDeleted: false,
        };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        return await EventCategory.countDocuments(query);
    }

    async findCategoryBySlug(slug: string): Promise<IEventCategoryDocument | null> {
        return await EventCategory.findOne({
            slug,
            isActive: true,
            isDeleted: false,
        }).lean();
    }

    async findAllActiveCategories(): Promise<IEventCategoryDocument[]> {
        return await EventCategory.find({
            isActive: true,
            isDeleted: false,
        })
            .sort({ name: 1 })
            .lean();
    }
}

export default new PublicEventCategoryRepository();