import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./utils/database.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", leadRoutes);
app.use("/api", chatRoutes);

// Error handling middleware
app.use(errorHandler);

// Socket.IO - Real-time Chat Handling
io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join a chat room
    socket.on("join_chat", (chatId) => {
        socket.join(chatId);
        console.log(`Client ${socket.id} joined chat room: ${chatId}`);
    });

    // Broadcast a new message to the chat room
    socket.on("send_message", (messageData) => {
        const { chatId, message } = messageData;
        console.log(`New message in chat ${chatId}:`, message);

        // Emit the message to all clients in the same chat room
        io.to(chatId).emit("receive_message", message);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
