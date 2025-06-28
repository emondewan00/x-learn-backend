import { Router } from "express";
import {
  getMyCourses,
  createUserCourse,
  updateCompleteLesson,
  changeActiveLesson,
  getUserCourseByCourseId,
} from "../controllers/userCourse.controller";
import checkJWTToken from "../middleware/checkJWTToken";

const userCourseRouter = Router();

userCourseRouter.get("/course/:id", checkJWTToken, getUserCourseByCourseId);
userCourseRouter.get("/", checkJWTToken, getMyCourses);
userCourseRouter.post("/", checkJWTToken, createUserCourse);
userCourseRouter.patch("/", checkJWTToken, updateCompleteLesson);
userCourseRouter.patch("/active", checkJWTToken, changeActiveLesson);

export default userCourseRouter;
