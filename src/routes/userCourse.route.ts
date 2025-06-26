import { Router } from "express";
import {
  getMyCourses,
  createUserCourse,
  updateUserCourse,
  updateCompleteLesson,
} from "../controllers/userCourse.controller";
import checkJWTToken from "../middleware/checkJWTToken";

const userCourseRouter = Router();

userCourseRouter.get("/", checkJWTToken, getMyCourses);
userCourseRouter.post("/", checkJWTToken, createUserCourse);
userCourseRouter.patch("/", checkJWTToken, updateUserCourse);
userCourseRouter.post("/complete", checkJWTToken, updateCompleteLesson);

export default userCourseRouter;
