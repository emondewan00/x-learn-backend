import { Router } from "express";
import {
  createLesson,
  deleteLesson,
  getLessons,
  getLessonById,
  updateLesson,
} from "../controllers/lesson.controller";
import checkJWTToken from "../middleware/checkJWTToken";

const lessonRouter = Router();

lessonRouter.get("/", getLessons);
lessonRouter.get("/:id", getLessonById);
lessonRouter.post("/", checkJWTToken, createLesson);
lessonRouter.patch("/:id", checkJWTToken, updateLesson);
lessonRouter.delete("/:id", checkJWTToken, deleteLesson);

export default lessonRouter;
