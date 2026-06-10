import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import { AppError } from "../utils/AppError.js";

export const parseResumeFile = async (file) => {
  if (!file) {
    throw new AppError("Resume file is required", 400);
  }

  if (file.mimetype === "application/pdf") {
    const data = await pdfParse(file.buffer);
    return data.text;
  }

  if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const data = await mammoth.extractRawText({ buffer: file.buffer });
    return data.value;
  }

  throw new AppError("Unsupported resume format", 400);
};
