import { Router } from "express";
import {
  getMyCourses,
  createUserCourse,
  updateUserCourse,
  updateCompleteLesson,
  changeActiveLesson,
} from "../controllers/userCourse.controller";
import checkJWTToken from "../middleware/checkJWTToken";

const userCourseRouter = Router();

userCourseRouter.get("/", checkJWTToken, getMyCourses);
userCourseRouter.post("/", checkJWTToken, createUserCourse);
userCourseRouter.patch("/", checkJWTToken, updateCompleteLesson);
userCourseRouter.patch("/active", checkJWTToken, changeActiveLesson);
// userCourseRouter.patch("/update/:id", checkJWTToken, updateUserCourse);

export default userCourseRouter;
