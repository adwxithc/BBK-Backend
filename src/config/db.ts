import mongoose, { Mongoose } from 'mongoose';

let cachedConnection: Mongoose | null = null;

export async function connectToDatabase(): Promise<Mongoose | undefined> {
    try {
        if (cachedConnection && mongoose.connection.readyState === 1) {
            console.log('✅ Using existing MongoDB connection');
            return cachedConnection;
        }

        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error(
                '❌ MONGO_URI is not defined in environment variables'
            );
        }

        console.log('🌱 Establishing new MongoDB connection...');
        const connection = await mongoose.connect(uri);

        console.log('✅ MongoDB connected successfully');
        cachedConnection = connection;
        return connection;
    } catch (error) {
        console.error('DB connection failed...', error);
    }
}
