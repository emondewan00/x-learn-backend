import { Router } from "express";
import {
  createLesson,
  deleteLesson,
  getLessons,
  getLessonById,
  updateLesson,
  updatePDF,
} from "../controllers/lesson.controller";
import checkJWTToken from "../middleware/checkJWTToken";
import { checkAdmin } from "../middleware/checkAdmin";
import upload from "../config/multer";

const lessonRouter = Router();

lessonRouter.get("/", getLessons);
lessonRouter.get("/:id", getLessonById);
lessonRouter.post("/", checkJWTToken, checkAdmin, createLesson);
lessonRouter.patch("/:id", checkJWTToken, checkAdmin, updateLesson);
lessonRouter.patch(
  "/pdf/:id",
  upload.array("files"),
  checkJWTToken,
  checkAdmin,
  updatePDF
);
lessonRouter.delete("/:id", checkJWTToken, checkAdmin, deleteLesson);

export default lessonRouter;
