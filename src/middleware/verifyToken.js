import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from '../models/userModel.js';

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "your_jwt_secret_key";

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET_KEY);

        // Ambil data user dari database menggunakan userId
        const user = await User.findById(decoded.userId).select("_id name email role");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Tambahkan data user ke request
        req.user = user;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
