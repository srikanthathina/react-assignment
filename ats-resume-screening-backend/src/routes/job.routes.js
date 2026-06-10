import { Router } from "express";
import { createJob, getJob, getJobs, updateJob } from "../controllers/job.controller.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createJobSchema, updateJobSchema } from "../validators/job.validator.js";

const router = Router();

router.use(protect);

router.route("/")
  .get(getJobs)
  .post(restrictTo("recruiter", "admin"), validate(createJobSchema), createJob);

router.route("/:id")
  .get(getJob)
  .patch(restrictTo("recruiter", "admin"), validate(updateJobSchema), updateJob);

export default router;
