import { Job } from "../models/Job.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createJob = asyncHandler(async (req, res) => {
  const job = await Job.create({
    ...req.body,
    createdBy: req.user._id
  });

  res.status(201).json({ status: "success", data: { job } });
});

export const getJobs = asyncHandler(async (req, res) => {
  const { status, skill, page = 1, limit = 10 } = req.query;
  const query = {};

  if (status) query.status = status;
  if (skill) query.requiredSkills = skill.toLowerCase();

  const jobs = await Job.find(query)
    .sort("-createdAt")
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Job.countDocuments(query);

  res.status(200).json({
    status: "success",
    results: jobs.length,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    },
    data: { jobs }
  });
});

export const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new AppError("Job not found", 404);
  res.status(200).json({ status: "success", data: { job } });
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) throw new AppError("Job not found or access denied", 404);
  res.status(200).json({ status: "success", data: { job } });
});
