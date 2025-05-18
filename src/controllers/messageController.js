import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import User from '../models/userModel.js';
import { generateBotResponse } from "../services/botService.js";

export const addMessage = async (req, res) => {
    try {
        const { chatId, message, senderType } = req.body;

        // Validasi input
        if (!chatId || !message || !senderType) {
            return res.status(400).json({
                message: "chatId, message, and senderType are required",
            });
        }

        // Temukan chat berdasarkan ID
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat ID not found" });
        }

        // Tambahkan pesan dari pengguna atau anonymous
        const userMessage = await Message.create({
            chatId,
            message,
            senderType,
            isBotResponse: senderType === "bot",
            isHumanResponse: senderType === "admin" || senderType === "anonymous",
        });

        // Tambahkan ID pesan ke chat
        chat.messages.push(userMessage._id);
        chat.updatedAt = new Date();
        await chat.save();

        // Jika botStatus aktif, tambahkan pesan bot
        let botMessage = null;
        if (chat.botStatus && senderType === "anonymous") {
            const botReply = generateBotResponse(message);
            if (botReply) {
                botMessage = await Message.create({
                    chatId,
                    message: botReply,
                    senderType: "bot",
                    isBotResponse: true,
                });

                // Tambahkan pesan bot ke chat
                chat.messages.push(botMessage._id);
                chat.updatedAt = new Date();
                await chat.save();
            }
        }

        res.status(201).json({
            message: "Message sent",
            data: userMessage,
            botMessage: botMessage || null,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const addMessageAdmin = async (req, res) => {
    try {
        const { chatId, message } = req.body;

        // Validate input
        if (!chatId || !message) {
            return res.status(400).json({ message: "Chat ID and message are required" });
        }

        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(403).json({ message: "Authentication required" });
        }

        // Get senderId from req.user
        const senderId = req.user._id;
        const senderType = req.user.role === "admin" ? "admin" : "user";

        // Find the chat to ensure it exists
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat ID not found" });
        }

        // Add the message to the database
        const adminMessage = await Message.create({
            chatId,
            senderType,
            senderId,
            message,
            isBotResponse: false,
            isHumanResponse: true,
        });

        // Add the message ID to the chat's messages array
        chat.messages.push(adminMessage._id);
        chat.updatedAt = new Date(); // Update the chat's updatedAt timestamp
        await chat.save();

        // Populate the sender details for the response
        const fullMessage = await Message.findById(adminMessage._id).populate("senderId", "name email role");

        res.status(201).json({
            message: "Message sent",
            adminMessage: fullMessage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};