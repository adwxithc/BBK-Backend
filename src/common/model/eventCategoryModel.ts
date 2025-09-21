import mongoose, { Schema, Document } from 'mongoose';

export interface IEventCategory {
  _id?: string;
  name: string;                    // "Annual Day", "Sports Day", "Teachers Day"
  description: string;             // Category description
  slug: string;                    // URL-friendly version: "annual-day"
  color: string;                   // Theme color for the category
  isActive: boolean;               // Whether category is active
  createdBy: string;               // Admin ID who created
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventCategoryDocument extends Document {
  name: string;
  description: string;
  slug: string;
  color: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventCategorySchema = new Schema<IEventCategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Category description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [100, 'Slug cannot exceed 100 characters'],
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
      trim: true,
      validate: {
        validator: function(v: string) {
          // Validate hex color format
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Color must be a valid hex color (e.g., #FF5733 or #F53)'
      }
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      required: [true, 'Created by is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create index for better query performance
eventCategorySchema.index({ isActive: 1 });
eventCategorySchema.index({ createdBy: 1 });

const EventCategory = mongoose.model<IEventCategoryDocument>('EventCategory', eventCategorySchema);

export default EventCategory;