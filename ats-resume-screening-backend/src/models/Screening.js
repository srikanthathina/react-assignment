import mongoose from "mongoose";

const screeningSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    matchedSkills: [String],
    missingSkills: [String],
    keywordGaps: [String],
    recommendation: {
      type: String,
      enum: ["strong_match", "good_match", "needs_improvement", "not_recommended"],
      required: true
    },
    summary: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

screeningSchema.index({ recruiter: 1, score: -1 });
screeningSchema.index({ job: 1, score: -1 });

export const Screening = mongoose.model("Screening", screeningSchema);
