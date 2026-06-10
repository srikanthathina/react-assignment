import { Router } from "express";
import { getMyResumes, getResume, uploadResumeController } from "../controllers/resume.controller.js";
import { protect } from "../middleware/auth.js";
import { uploadResume } from "../middleware/upload.js";

const router = Router();

router.use(protect);

router.post("/", uploadResume.single("resume"), uploadResumeController);
router.get("/", getMyResumes);
router.get("/:id", getResume);

export default router;
