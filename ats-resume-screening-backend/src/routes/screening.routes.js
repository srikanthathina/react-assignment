import { Router } from "express";
import { createScreening, getScreening, getScreenings } from "../controllers/screening.controller.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createScreeningSchema } from "../validators/screening.validator.js";

const router = Router();

router.use(protect, restrictTo("recruiter", "admin"));

router.route("/")
  .get(getScreenings)
  .post(validate(createScreeningSchema), createScreening);

router.get("/:id", getScreening);

export default router;
