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
        search?: string;
        limit?: number;
        skip?: number;
    }): Promise<IEventCategoryDocument[]> {
        const query: any = { isDeleted: false };
        
        if (options?.isActive !== undefined) {
            query.isActive = options.isActive;
        }

        if (options?.search) {
            query.$or = [
                { name: { $regex: options.search, $options: 'i' } },
                { slug: { $regex: options.search, $options: 'i' } }
            ];
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
        return await EventCategory.findOne({ _id: id, isDeleted: false }).exec();
    }

    async findBySlug(slug: string): Promise<IEventCategoryDocument | null> {
        return await EventCategory.findOne({ slug, isDeleted: false }).exec();
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
            { isDeleted: true, updatedAt: new Date() },
            { new: true }
        ).exec();
    }


    async count(options?: { 
        isActive?: boolean;
        search?: string;
    }): Promise<number> {
        const query: any = { isDeleted: false };
        
        if (options?.isActive !== undefined) {
            query.isActive = options.isActive;
        }

        if (options?.search) {
            query.$or = [
                { name: { $regex: options.search, $options: 'i' } },
                { slug: { $regex: options.search, $options: 'i' } }
            ];
        }

        return await EventCategory.countDocuments(query).exec();
    }

    async checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
        const query: any = { slug, isDeleted: false };
        
        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const existing = await EventCategory.findOne(query).exec();
        return !!existing;
    }
}

export default new EventCategoryRepository();