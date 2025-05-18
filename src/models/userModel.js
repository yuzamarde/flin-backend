import mongoose from 'mongoose';

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
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
    role: {
        type: String,
        enum: ['manager', 'admin'], // ✅ Added `client` role
        default: 'admin',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

}, { timestamps: true });

export default mongoose.model('User', userModel);
