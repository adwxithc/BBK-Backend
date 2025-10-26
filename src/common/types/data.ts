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
    featured: boolean;
    caption: string;
    type: 'image' | 'video';
    contentType: string;
    key: string;
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
    medias: IEventMediaItem[];      // Event images and videos
    
    // Status
    status: 'draft' | 'published' | 'archived';
    featured: boolean;               // Whether to feature on homepage
    
    // Metadata
    createdBy: string;               // Admin ID
    createdAt?: Date;
    updatedAt?: Date;
}

export interface MediaFile {
    contentType: string;
    type: 'image' | 'video';
    size?: number;
    id: string;
}
