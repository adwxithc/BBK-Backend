import EventCategory, { IEventCategoryDocument } from '@common/model/eventCategoryModel';

class EventCategoryRepository {
    async create(categoryData: {
        name: string;
        description: string;
        slug: string;
        color: string;
        createdBy: string;
    }): Promise<IEventCategoryDocument> {
        const category = new EventCategory(categoryData);
        return await category.save();
    }

    async findAll(options?: {
        isActive?: boolean;
        limit?: number;
        skip?: number;
    }): Promise<IEventCategoryDocument[]> {
        const query: any = {};
        
        if (options?.isActive !== undefined) {
            query.isActive = options.isActive;
        }

        let mongoQuery = EventCategory.find(query).sort({ createdAt: -1 });

        if (options?.limit) {
            mongoQuery = mongoQuery.limit(options.limit);
        }

        if (options?.skip) {
            mongoQuery = mongoQuery.skip(options.skip);
        }

        return await mongoQuery.exec();
    }

    async findById(id: string): Promise<IEventCategoryDocument | null> {
        return await EventCategory.findById(id).exec();
    }

    async findBySlug(slug: string): Promise<IEventCategoryDocument | null> {
        return await EventCategory.findOne({ slug }).exec();
    }

    async update(
        id: string,
        updateData: {
            name?: string;
            description?: string;
            slug?: string;
            color?: string;
        }
    ): Promise<IEventCategoryDocument | null> {
        return await EventCategory.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).exec();
    }

    async softDelete(id: string): Promise<IEventCategoryDocument | null> {
        return await EventCategory.findByIdAndUpdate(
            id,
            { isActive: false, updatedAt: new Date() },
            { new: true }
        ).exec();
    }

    async toggleActive(id: string, isActive: boolean): Promise<IEventCategoryDocument | null> {
        return await EventCategory.findByIdAndUpdate(
            id,
            { isActive, updatedAt: new Date() },
            { new: true }
        ).exec();
    }

    async count(options?: { isActive?: boolean }): Promise<number> {
        const query: any = {};
        
        if (options?.isActive !== undefined) {
            query.isActive = options.isActive;
        }

        return await EventCategory.countDocuments(query).exec();
    }

    async checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
        const query: any = { slug };
        
        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const existing = await EventCategory.findOne(query).exec();
        return !!existing;
    }
}

export default new EventCategoryRepository();