import mongoose, { Schema } from 'mongoose';
import { IAdmin } from '../types/data';

const adminSchema = new Schema<IAdmin>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profile: String,
    },
    {
        timestamps: true,
    }
);

const AdminModel = mongoose.model<IAdmin>('Admin', adminSchema);

export default AdminModel;
