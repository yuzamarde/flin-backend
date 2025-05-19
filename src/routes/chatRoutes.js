// /backend/routes/chatRoutes.js
import express from "express";
import upload from "../utils/multer.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { createChat, getAllChats, getChatById, getChatMessages, updateBotStatus } from "../controllers/chatController.js";
import { addMessage, addMessageAdmin, streamChatMessages } from "../controllers/messageController.js";

const chatRoutes = express.Router();

// ✅ chat route
chatRoutes.post("/chats", upload, createChat);
chatRoutes.put("/chats/:chatId/bot-status", verifyToken, updateBotStatus);
chatRoutes.get("/chats/:chatId/messages", upload, getChatMessages);
chatRoutes.get("/chats/:chatId", getChatById);
chatRoutes.get("/chats", verifyToken, getAllChats);
chatRoutes.get("/chats/:chatId/stream", streamChatMessages);

// ✅ message route
chatRoutes.post("/chats/messages", upload, addMessage);
chatRoutes.post("/chats/messages-admin", verifyToken, upload, addMessageAdmin);




export default chatRoutes;
