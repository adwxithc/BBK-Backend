import EventModel from '@common/model/eventModel';
import { IEvent } from '@common/types/data';

class EventRepsitory {
    async createEvent(newEvent: IEvent) {
        return await EventModel.create(newEvent);
    }
    async findBySlug(slug: string): Promise<IEvent | null> {
        return await EventModel.findOne({ slug, isDeleted: false }).exec();
    }

    async findAll(options?: {
        status?: string;
        featured?: string;
        search?: string;
        limit?: number;
        skip?: number;
    }): Promise<IEvent[]> {

        const query: any = { isDeleted: false };
        if (options?.status) {
            query.status = options.status;
        }
        if (options?.featured) {
            query.featured = options.featured;
        }
        if (options?.search && options.search.trim()) {
            // Use regex for partial matching with case-insensitive search
            const searchTerm = options.search.trim();
            query.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        let mongoQuery = EventModel.find(query).sort({ createdAt: -1 });

        if (options?.limit) {
            mongoQuery = mongoQuery.limit(options.limit);
        }
        if (options?.skip) {
            mongoQuery = mongoQuery.skip(options.skip);
        }
        return await mongoQuery.exec();
    }

    async count(options?: {
        status?: string;
        featured?: string;
        search?: string;
    }): Promise<number> {
        const query: any = { isDeleted: false };
        if (options?.status) {
            query.status = options.status;
        }
        if (options?.featured) {
            query.featured = options.featured;
        }
        if (options?.search && options.search.trim()) {
            const searchTerm = options.search.trim();
            query.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        return await EventModel.countDocuments(query).exec();
    }
}

export default new EventRepsitory();
