import { Router } from "express";

import {
  createCourse,
  deleteCourse,
  getAllCourses,
  updateCourse,
  getCourseById,
} from "../controllers/course.controller";
import upload from "../config/multer";
import checkJWTToken from "../middleware/checkJWTToken";

const courseRouter = Router();

courseRouter.get("/", getAllCourses);
courseRouter.get("/:id", getCourseById);
courseRouter.post("/", checkJWTToken, upload.single("image"), createCourse);
courseRouter.patch("/:id", checkJWTToken, updateCourse);
courseRouter.delete("/:id", checkJWTToken, deleteCourse);

export default courseRouter;
