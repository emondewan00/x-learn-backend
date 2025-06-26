import express from "express";
import cors from "cors";
import cookiesParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/connectDB";
dotenv.config();
import authRouter from "./routes/auth.route";
import courseRouter from "./routes/course.route";
import moduleRouter from "./routes/module.route";
import lessonRouter from "./routes/lesson.route";
import userCourseRouter from "./routes/userCourse.route";

const app = express();

connectDB();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookiesParser());

app.use(express.static("src/uploads"));
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/modules", moduleRouter);
app.use("/api/lessons", lessonRouter);
app.use("/api/userCourses", userCourseRouter);

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

export default app;
