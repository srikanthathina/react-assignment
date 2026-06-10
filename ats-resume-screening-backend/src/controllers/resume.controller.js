import { Resume } from "../models/Resume.js";
import { parseResumeFile } from "../services/resumeParser.js";
import { extractSkills, extractYearsOfExperience } from "../services/skillExtractor.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const uploadResumeController = asyncHandler(async (req, res) => {
  const extractedText = await parseResumeFile(req.file);
  const skills = extractSkills(extractedText);
  const yearsOfExperience = extractYearsOfExperience(extractedText);

  const resume = await Resume.create({
    owner: req.user._id,
    candidateName: req.body.candidateName || req.user.name,
    fileName: req.file.originalname,
    mimeType: req.file.mimetype,
    extractedText,
    skills,
    yearsOfExperience
  });

  res.status(201).json({ status: "success", data: { resume } });
});

export const getMyResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ owner: req.user._id }).sort("-createdAt");
  res.status(200).json({ status: "success", results: resumes.length, data: { resumes } });
});

export const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, owner: req.user._id });
  if (!resume) throw new AppError("Resume not found", 404);
  res.status(200).json({ status: "success", data: { resume } });
});
