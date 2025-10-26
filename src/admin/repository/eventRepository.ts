import EventModel from '@common/model/eventModel';
import { IEvent } from '@common/types/data';

class EventRepsitory {
    async createEvent(newEvent: IEvent) {
        return await EventModel.create(newEvent);
    }
    async findBySlug(slug: string): Promise<IEvent | null> {
        return await EventModel.findOne({ slug, isDeleted: false }).exec();
    }
}

export default new EventRepsitory();
