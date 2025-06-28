import { Router } from "express";

import {
  createCourse,
  deleteCourse,
  getAllCourses,
  updateCourse,
  getCourseById,
  getAllCoursesForAdmin,
  updateCourseImage,
} from "../controllers/course.controller";
import upload from "../config/multer";
import checkJWTToken from "../middleware/checkJWTToken";
import { optionalAuth } from "../middleware/optionalAuth";
import { checkAdmin } from "../middleware/checkAdmin";

const courseRouter = Router();

courseRouter.get("/", getAllCourses);
courseRouter.get("/all", checkJWTToken, getAllCoursesForAdmin);
courseRouter.get("/:id", optionalAuth, getCourseById);
courseRouter.post(
  "/",
  checkJWTToken,
  checkAdmin,
  upload.single("image"),
  createCourse
);
courseRouter.patch(
  "/image/:id",
  checkJWTToken,
  checkAdmin,
  upload.single("image"),
  updateCourseImage
);
courseRouter.patch("/:id", checkJWTToken, checkAdmin, updateCourse);
courseRouter.delete("/:id", checkJWTToken, checkAdmin, deleteCourse);

export default courseRouter;
