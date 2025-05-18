// /backend/models/Message.js
import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    senderType: {
        type: String,
        enum: ["anonymous", "user", "bot", "admin"],
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false, // Hanya diperlukan untuk user dan admin
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    isBotResponse: {
        type: Boolean,
        default: false,
    },
    isHumanResponse: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model("Message", messageModel);
