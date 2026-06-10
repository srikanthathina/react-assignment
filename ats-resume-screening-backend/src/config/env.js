import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ats_resume_screening",
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret_change_before_deployment",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  MAX_FILE_SIZE_MB: Number(process.env.MAX_FILE_SIZE_MB || 5)
};
