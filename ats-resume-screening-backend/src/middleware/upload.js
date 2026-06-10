import multer from "multer";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

const storage = multer.memoryStorage();

export const uploadResume = multer({
  storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new AppError("Only PDF and DOCX resumes are allowed", 400));
    }

    return cb(null, true);
  }
});
