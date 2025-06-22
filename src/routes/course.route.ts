import { Router } from "express";

import {
  createCourse,
  deleteCourse,
  getAllCourses,
  updateCourse,
  getCourseById,
} from "../controllers/course.controller";
import upload from "../config/multer";

const courseRouter = Router();

courseRouter.get("/", getAllCourses);
courseRouter.get("/:id", getCourseById);
courseRouter.post("/", upload.single("image"), createCourse);
courseRouter.patch("/:id", updateCourse);
courseRouter.delete("/:id", deleteCourse);

export default courseRouter;
