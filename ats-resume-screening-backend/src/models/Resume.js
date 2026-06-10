import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    candidateName: {
      type: String,
      required: true,
      trim: true
    },
    fileName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    extractedText: {
      type: String,
      required: true
    },
    skills: [String],
    yearsOfExperience: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

resumeSchema.index({ owner: 1, createdAt: -1 });
resumeSchema.index({ skills: 1 });

export const Resume = mongoose.model("Resume", resumeSchema);
