import multer from "multer";
import path from "path";

// File Storage Configuration (No File Upload)
const storage = multer.memoryStorage(); // Use memory storage for non-file data

// Multer Middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max file size (adjust as needed)
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'].includes(ext)) {
            return cb(new Error("Only image and document files are allowed"), false);
        }
        cb(null, true);
    },
}).none(); // Use `.none()` to disable file upload

export default upload;
