import { Router } from "express";
import { getRecruiterDashboard } from "../controllers/dashboard.controller.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

router.get("/recruiter", protect, restrictTo("recruiter", "admin"), getRecruiterDashboard);

export default router;
