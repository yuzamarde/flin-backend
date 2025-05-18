import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const dbUri = process.env.MONGODB_URI;
        console.log("MONGODB_URI:", dbUri);  // Debugging line
        if (!dbUri) {
            throw new Error('MongoDB URI is not defined in .env');
        }
        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,  // Penting untuk serverless
            socketTimeoutMS: 10000
        });
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error(`❌ MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
};

export default connectDB;
