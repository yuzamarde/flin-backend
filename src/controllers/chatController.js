// /backend/controllers/chatController.js
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import User from '../models/userModel.js';

// ✅ Create a new chat
export const createChat = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;
        const isAnonymous = !userId;

        // Buat sesi chat baru
        const chat = await Chat.create({
            userId,
            isAnonymous,
        });

        res.status(201).json({
            message: "Chat session created",
            chatId: chat._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateBotStatus = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { botStatus } = req.body;

        // Validasi input
        if (typeof botStatus !== "boolean") {
            return res.status(400).json({ message: "botStatus must be a boolean value" });
        }

        // Perbarui botStatus pada chat
        const chat = await Chat.findByIdAndUpdate(
            chatId,
            { botStatus, updatedAt: Date.now() },
            { new: true }
        );

        // Jika chat tidak ditemukan
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.status(200).json({
            message: "Chat updated successfully",
            chat,
        });
    } catch (error) {
        console.error("Error in updateBotStatus:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// ✅ Get all messages in a chat
export const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        // Cari semua pesan di sesi chat ini
        const messages = await Message.find({ chatId }).sort({ timestamp: 1 });

        res.status(200).json({
            message: "Chat messages fetched successfully",
            messages,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getChatById = async (req, res) => {
    try {
        const { chatId } = req.params;

        // Validate the chat ID
        if (!chatId) {
            return res.status(400).json({ message: "Chat ID is required" });
        }

        // Find the chat by ID and populate messages
        const chat = await Chat.findById(chatId)
            .populate({
                path: "messages",
                populate: {
                    path: "senderId",
                    select: "name email role",
                },
                options: { sort: { timestamp: 1 } }, // Sort messages by timestamp (oldest to newest)
            })
            .populate("userId", "name email role"); // Include user details if the chat is not anonymous

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.status(200).json({
            message: "Chat retrieved successfully",
            chat,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};