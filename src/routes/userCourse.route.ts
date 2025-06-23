import { Router } from "express";
import {
  getMyCourses,
  createUserCourse,
} from "../controllers/userCourse.controller";
import checkJWTToken from "../middleware/checkJWTToken";

const userCourseRouter = Router();

userCourseRouter.get("/", checkJWTToken, getMyCourses);
userCourseRouter.post("/", checkJWTToken, createUserCourse);

export default userCourseRouter;
