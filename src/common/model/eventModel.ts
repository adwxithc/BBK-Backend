import mongoose, { Schema } from 'mongoose';
import { IEvent, IEventMediaItem } from '../types/data';

const eventMediaItemSchema = new Schema<IEventMediaItem>({
    url: {
        type: String,
        required: true,
    },
    contentType: {
        type: String,
        enum: ['image', 'video'],
        required: true,
    },
    caption: {
        type: String,
    },
    altText: {
        type: String,
    },
    duration: {
        type: Number,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
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
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        
        // Category relationship
        categoryId: {
            type: String,
            required: true,
            ref: 'EventCategory',
        },
        
        // Event details
        date: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
        },
        time: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        
        // Media
        coverImage: {
            type: String,
        },
        gallery: [eventMediaItemSchema],
        
        // Status
        status: {
            type: String,
            enum: ['draft', 'published', 'completed', 'cancelled'],
            default: 'draft',
        },
        featured: {
            type: Boolean,
            default: false,
        },
        
        // Metadata
        createdBy: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
eventSchema.index({ categoryId: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ featured: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ slug: 1 });

// Virtual populate for category
eventSchema.virtual('category', {
    ref: 'EventCategory',
    localField: 'categoryId',
    foreignField: '_id',
    justOne: true,
});

const EventModel = mongoose.model<IEvent>('Event', eventSchema);

export default EventModel;
