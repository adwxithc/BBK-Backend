import mongoose, { Schema, Document } from 'mongoose';

export interface IContactForm extends Document {
    fullName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}

const contactFormSchema = new Schema<IContactForm>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
            enum: [
                'Enrollment Inquiry',
                'Schedule a Tour',
                'General Question',
                'Feedback',
                'Other'
            ],
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const ContactFormModel = mongoose.model<IContactForm>(
    'ContactForm',
    contactFormSchema
);

export default ContactFormModel;
