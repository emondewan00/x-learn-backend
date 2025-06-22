import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connectDB";
dotenv.config();
import authRouter from "./routes/auth.route";
import courseRouter from "./routes/course.route";
import moduleRouter from "./routes/module.route";

const app = express();

connectDB();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/modules", moduleRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

export default app;
