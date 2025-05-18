// /backend/models/Chat.js
import mongoose from "mongoose";

const chatModel = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false, // Bisa kosong untuk Anonymous
    },
    isAnonymous: {
        type: Boolean,
        default: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    botStatus: {
        type: Boolean,
        default: true, // Bot akan mencoba menjawab terlebih dahulu
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            required: true,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Chat", chatModel);
