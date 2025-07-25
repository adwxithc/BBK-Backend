import EventModel from '@common/model/eventModel';
import { IEvent } from '@common/types/data';

class EventRepsitory {
    async createEvent(newEvent: IEvent) {
        return await EventModel.create(newEvent);
    }
}

export default new EventRepsitory();
