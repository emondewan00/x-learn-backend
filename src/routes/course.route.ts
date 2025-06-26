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
import { optionalAuth } from "../middleware/optionalAuth";
import { checkAdmin } from "../middleware/checkAdmin";

const courseRouter = Router();

courseRouter.get("/", optionalAuth, getAllCourses);
courseRouter.get("/:id", optionalAuth, getCourseById);
courseRouter.post(
  "/",
  checkJWTToken,
  checkAdmin,
  upload.single("image"),
  createCourse
);
courseRouter.patch("/:id", checkJWTToken, checkAdmin, updateCourse);
courseRouter.delete("/:id", checkJWTToken, checkAdmin, deleteCourse);

export default courseRouter;
