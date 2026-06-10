import { Job } from "../models/Job.js";
import { Resume } from "../models/Resume.js";
import { Screening } from "../models/Screening.js";
import { calculateMatchScore } from "../services/scoringEngine.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createScreening = asyncHandler(async (req, res) => {
  const { resumeId, jobId } = req.body;

  const [resume, job] = await Promise.all([
    Resume.findById(resumeId),
    Job.findById(jobId)
  ]);

  if (!resume) throw new AppError("Resume not found", 404);
  if (!job) throw new AppError("Job not found", 404);

  const result = calculateMatchScore({ resume, job });
  const screening = await Screening.create({
    recruiter: req.user._id,
    resume: resume._id,
    job: job._id,
    ...result
  });

  res.status(201).json({ status: "success", data: { screening } });
});

export const getScreenings = asyncHandler(async (req, res) => {
  const { jobId } = req.query;
  const query = { recruiter: req.user._id };
  if (jobId) query.job = jobId;

  const screenings = await Screening.find(query)
    .populate("resume", "candidateName skills yearsOfExperience")
    .populate("job", "title company")
    .sort("-score -createdAt");

  res.status(200).json({
    status: "success",
    results: screenings.length,
    data: { screenings }
  });
});

export const getScreening = asyncHandler(async (req, res) => {
  const screening = await Screening.findOne({
    _id: req.params.id,
    recruiter: req.user._id
  })
    .populate("resume")
    .populate("job");

  if (!screening) throw new AppError("Screening not found", 404);
  res.status(200).json({ status: "success", data: { screening } });
});
