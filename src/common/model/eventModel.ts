import mongoose, { Schema } from 'mongoose';
import { IEvent, IMediaData } from '../types/data';

const mediaSchema = new Schema<IMediaData>({
    key: {
        type: String,
        required: true,
    },
    contentType: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
});

const eventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        photos: [mediaSchema],
        videos: [mediaSchema],
    },
    {
        timestamps: true,
    }
);

const EventModel = mongoose.model<IEvent>('Event', eventSchema);

export default EventModel;
