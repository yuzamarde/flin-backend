import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const SALT_ROUNDS = 10;

// Sign Up Action
export const signUpAction = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        // Extract name from email (before @)
        const name = email.split("@")[0];

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "admin",
            createdAt: new Date(),
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
            },
        });
    } catch (error) {
        console.error("Error in signUpAction:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Sign In Action
export const signInAction = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id.toString(), // ✅ Gunakan userId untuk konsistensi
                email: user.email,
                role: user.role,
            },
            JWT_SECRET_KEY,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: 'User logged in successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        console.error('Error in signInAction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
