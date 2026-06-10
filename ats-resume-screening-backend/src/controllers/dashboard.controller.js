import { Job } from "../models/Job.js";
import { Resume } from "../models/Resume.js";
import { Screening } from "../models/Screening.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getRecruiterDashboard = asyncHandler(async (req, res) => {
  const [jobs, resumes, screenings, recommendationBreakdown, topCandidates] = await Promise.all([
    Job.countDocuments({ createdBy: req.user._id }),
    Resume.countDocuments(),
    Screening.countDocuments({ recruiter: req.user._id }),
    Screening.aggregate([
      { $match: { recruiter: req.user._id } },
      { $group: { _id: "$recommendation", count: { $sum: 1 }, averageScore: { $avg: "$score" } } }
    ]),
    Screening.find({ recruiter: req.user._id })
      .populate("resume", "candidateName skills")
      .populate("job", "title company")
      .sort("-score")
      .limit(5)
  ]);

  res.status(200).json({
    status: "success",
    data: {
      totals: { jobs, resumes, screenings },
      recommendationBreakdown,
      topCandidates
    }
  });
});
