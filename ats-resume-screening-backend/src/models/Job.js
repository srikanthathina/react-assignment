import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      default: "Remote"
    },
    description: {
      type: String,
      required: true
    },
    requiredSkills: [String],
    minExperience: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open"
    }
  },
  { timestamps: true }
);

jobSchema.index({ createdBy: 1, createdAt: -1 });
jobSchema.index({ requiredSkills: 1 });

export const Job = mongoose.model("Job", jobSchema);
