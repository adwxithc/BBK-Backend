import { IEventCategory } from '../model/eventCategoryModel';

export interface IAdmin {
    _id: string;
    name: string;
    email: string;
    password: string;
    profile?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IMediaData {
    key: string;
    contentType: string;
    size: number;
}

export interface IEventMediaItem {
    _id?: string;
    url: string;                     // Media URL (image or video)
    contentType: 'image' | 'video';         // Media type
    caption?: string;                // Optional media caption
    altText?: string;                // Accessibility text (mainly for images)
    duration?: number;               // Video duration in seconds
    featured: boolean;               // Whether media is featured
    uploadedAt: Date;
}

export interface IEvent {
    _id?: string;
    title: string;                   // "Annual Day 2026", "Sports Day 2025"
    description: string;             // Event description
    slug: string;                    // URL-friendly: "annual-day-2026"
    
    // Category relationship
    categoryId: string;              // Reference to EventCategory._id
    category?: IEventCategory;       // Populated category data
    
    // Event details
    date: Date;                      // Event start date
    endDate?: Date;                  // Optional end date for multi-day events
    time: string;                    // "10:00 AM - 4:00 PM", "All Day"
    location: string;                // Venue details
    
    // Media
    coverImage?: string;             // Main event poster/image URL
    gallery: IEventMediaItem[];      // Event images and videos
    
    // Status
    status: 'draft' | 'published' | 'completed' | 'cancelled';
    featured: boolean;               // Whether to feature on homepage
    
    // Metadata
    createdBy: string;               // Admin ID
    createdAt: Date;
    updatedAt: Date;
}

export interface MediaFile {
    contentType: string;
    type: 'image' | 'video';
    size?: number;
}
